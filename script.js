const input = document.querySelector("#inputText"); // İnput nesnesi seçildi.
const addButton = document.querySelector("#addButton"); // Ekle Butonu seçildi.
const list = document.querySelector("#list"); // Liste DİV'i seçildi.
const pendingTasks = document.querySelector("#pendingTasks"); // Mevcut liste elemanlarının sayısı için seçildi.
const clearAllButton = document.querySelector("#clearAll"); // Temizle Butonu seçildi.

let listArray; // Local Storage'da kullanılacak Dizi.

showListItems(); // Locale Storage'dan dönen veriye göre Liste elemanlarını gösterir.

addButton.addEventListener("click", checkInputData); // Ekle Butonuna olay dinleyicisi eklendi.

// Bu fonksiyon Ekle butonuna tıklandığında çalışır.Amacı Girilen text'in geçerliliğini kontrol etmektir.
function checkInputData() {
  let inputText = input.value; // inputa girilen text'i değişkene atar.
  if (inputText.trim() != 0) {
    // trim fonksiyonu ile input a girilen text'in boş olup olmadığını kontrol eder.
    addListItem(inputText); // eğer boş değilse listeye ekleme fonksiyonu çağırılır.
    showAlert("success", "Ekleme İşlemi Başarılı."); // Listeye ekleme işleminden sonra Başarılı uyarı döndürür.
  } else {
    showAlert("warning", "Lütfen Geçerli değerler giriniz."); // Girilen text geçersiz ise Başarısız uyarı döndürür.
  }
}

// Bu fonksiyon Ekle butonuna tıklandığında text kontrolünün ardından başarılı olması durumunda çalışır.Local Storage'a veri ekler.
function addListItem(inputText) {
  let getLocalStorage = localStorage.getItem("listItem");
  // LocalStorage'dan listItem anahtarına sahip elemanları getirir ve bir değişkene atar.
  if (getLocalStorage == null) {
    // Bu kontrol Eğer listItem anahtarına sahip bir nesne bulunamazsa çalışır.
    listArray = []; // Eğer bulunmuyorsa boş bir dizi oluşturur.
  } else {
    // Bu kontrol eğer listItem anahtarına sahip değerler var ise yani getLocaltorage değişkeni null değilse çalışır.
    listArray = JSON.parse(getLocalStorage);
    // Bulunan değerler parse işlemine tabi tutularak daha önceden global tanımladığımız listArray dizisine atanır.
    // Bu işlem daha önceden LocalStorage'da olan değerleri kaybetmemek için önemlidir.
  }
  listArray.push(inputText); // Parametre olarak inputtan gelen yeni text Listeye eklenir.
  localStorage.setItem("listItem", JSON.stringify(listArray)); // Değerleri tutan dizi tekrar LocalStorage'a kaydedilir.
  showListItems();
  // Oluşan yeni dizinin kullanıcı arayüzünde görünmesi için showListItems fonksiyonu bu işlemler olduktan sonra tekrar çağırılır.
}

// Bu fonksiyon Listeden eleman silmek için her bir liste elemanındaki çarpı butonuna tıklandığında çalışır.HTML etiketinde tanımlanmış onclick özelliği ile tetiklenir ve index parametresini dinamik olarak buradan çeker.
function deleteListItem(index) {
  let getLocalStorage = localStorage.getItem("listItem"); // LocalStorage'dan listItem anahtarına sahip değerleri getirir.
  listArray = JSON.parse(getLocalStorage); // parse işlemi ile bunu işlenebilir hale getirip listArray'a atar.
  listArray.splice(index, 1); // Splice fonksiyonu ile belirtilen indexteki 2. parametrede belirtildiği gibi 1 adet eleman silinir.
  localStorage.setItem("listItem", JSON.stringify(listArray)); // Oluşan yeni liste işlemin tamamlanmış olması için tekrar LocalStorage'a kayıt edilir.
  showListItems(); // Oluşan yeni durumun kullanıcı arayüzünde gösterilmesi için showListItems fonksiyonu çağırılır.
}

// Bu fonksiyon LocalStorage'da yaptığımız değişikliklerin kullanıcı arayüzüne işlenmesini sağlar.
function showListItems() {
  let getLocalStorage = localStorage.getItem("listItem"); // LocalStorage'dan listItem anahtarına sahip veriyi çeker.
  if (getLocalStorage == null) {
    // listItem Boş ise listArray dizisine boş bir dizi atar.
    listArray = [];
  } else {
    // Boş değilse var olan veriyi parse ederek listArray dizisine atar.
    listArray = JSON.parse(getLocalStorage);
  }

  let listItem = ``; // HTML dökümanına dinamik olarak enjekte edilip UI da görünür olacak liste elemanları için boş bir template literal tanımlanması yapılır.

  listArray.forEach((listText, index) => {
    // forEach fonksiyonu ile Dizi elemanları tek tek gezilerek text ve bulundukları index bilgilerine erişim sağlanır.
    listItem += `
    <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between rounded-pill my-1">
    <span class="font-monospace fs-semibold">${listText}</span>
    <button onclick="deleteListItem(${index})" id="deleteButton" class="btn btn-close"></button>
    </a>
    `;
  }); // forEach döngüsünün her çalışmasında ListArray dizisindeki elemanların değerleri UI da görünecek olan liste elemanına atanır ve hepsinin doğru bir şekilde görünür olabilmesi için += operatörü ile uç uca eklenir.
  pendingTasks.textContent = listArray.length; // Güncel liste elemanı sayısına bu bloktan ulaşabildiğimiz için mevcut elemanların sayısını pendingTasks elementine bu noktada aktarır.
  list.innerHTML = listItem; // UI'da görünecek olan liste elemanlarının tamamını tutan listItem değişkenini list div'inin içine enjekte eder.
  inputText.value = ""; // Eklenen text'i input nesnesinin üzerinden temizler.
}

// Bu Event Listener fonksiyonu input nesnesinin içerisinde enter tuşuna basıldığında Ekle butonuna basıldığında gerçekleşen işlevleri uygular. Kullanıcı deneyimini artırmayı amaçlar.
input.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    // Eğer basılıp-çekilen tuş Enter ise,
    checkInputData(); // checkInputData fonksiyonuna dallan.
  }
});

// Bu fonksiyon çeşitli durumlarda ekranın sağ üst köşesinde bir uyarı mesajı verir.Parametre olarak uyarı tipi ve mesaj alır.Çeşitli durumlar için özelleştirilebilir.
function showAlert(type, message) {
  let alert = document.createElement("div"); // Uyarı mesajı için bir div elementi oluşturulur.
  alert.className = `alert alert-${type} w-30 position-absolute top-0 end-0 opacity-75`; //className özelliği ile bootstrap classları eklenerek özelleştirilir ve dinamik olarak tip bilgisi template literal kullanılarak eklenilir.
  alert.textContent = message; // Mesaj parametresi ile gönderilen mesaj metni oluşşturulan div'in text içeriğine atanır.

  document.body.prepend(alert); // Oluşturulan div elementi prepend fonksiyonu ile body etiketinin başına eklenir.
  setTimeout(() => {
    // Oluşturulan uyarı mesajının 2 saniye sonra kaldırılması için setTimeout kullanılır.
    alert.remove();
  }, 2000);
}

clearAllButton.addEventListener("click", clearAll); // Temizle butonu için bir event listener tanımlanır.Tıklandığında aktif olur ve clearAll fonksiyonunu çağırır.

// Bu fonksiyon bütün liste elemanlarını toplu bir şekilde silme işlevini yürütür.
function clearAll() {
  let getLocalStorage = localStorage.getItem("listItem"); // LocalStorage'dan listItem elemanları çekilir.
  listArray = JSON.parse(getLocalStorage); // parse işlemi ile JSON formatından dönüştürülerek listArray dizisine atanır.
  listArray = []; // Dizideki tüm elemanlar diziye boş dizi atanarak silinir.
  localStorage.setItem("listItem", JSON.stringify(listArray)); // Oluşan yeni dizi LocalStorage'a set edilir.
  showAlert("danger", "Tüm ögeler temizlendi."); // Tüm ögelerin silindiğine dair bir Danger tipinde mesaj oluşturuldu.
  showListItems(); // Oluşan yeni durumun UI da görünmesi için showListItems fonksiyonu tekrar çağırılır.
}

// Bu fonksiyon formatlı bir biçimde Tarih bilgisini gösterir.
function showDate() {
  const date = new Date(); // Bir date nesnesi oluşturuldu.
  const dateDisplay = document.querySelector("#date"); // HTML dökümanında tarihin gösterileceği element seçildi.
  const formattedDate = date.toLocaleDateString(); // Formatlanmış biçimdeki tarih bilgisi Değişkene atandı.
  dateDisplay.textContent = formattedDate; // Tarih bilgisinin tutulduğu değişkenin değeri seçilen elemente enjekte edildi.
}
showDate();

//Bu fonksiyon formatlı bir biçimde Saat bilgisini gösterir.Saat dinamik olarak her saniye güncellenir.
function showClock() {
  const date = new Date(); // Bir date nesnesi oluşturuldu.
  const timeDisplay = document.querySelector("#time"); // HTML dökümanında saatin gösterileceği element seçildi.
  const formattedTime = date.toLocaleTimeString(); // Formatlı bir biçimde saat bilgisi bir değişkene atandı.
  timeDisplay.textContent = formattedTime; // Saat bilgisinin tutulduğu değişkenin değeri seçilen elemente enjekte edildi.
}
showClock(); // sayfa yenilendiğinde ilk 1 saniyede de saatin görünür olması için showClock fonksiyonu çağırıldı.
setInterval(showClock, 1000); // setInterval kullanılarak ekranda her saniye saat bilgisinin güncellenmesi sağlandı.
