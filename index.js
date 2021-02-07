let form = document.querySelector("#formAdd");
let formUpdate = document.querySelector("#formUpdate");
let allQuestins = document.querySelector("#allQuestions");
let solutionSection = document.querySelector(".main-solution-section");
let update = document.querySelector("#update");
let importantId = document.querySelector("#importantId");
const divUsers = document.querySelector(".div-users");

//modal
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
//var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
// btn.onclick = function () {
//   modal.style.display = "block";
// };

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//adding questions
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.name.value == "" || form.question.value == "") {
    alert("No blanks allowed");
  } else {
    alert("Your question has been submitted!!!");
    db.collection("students")
      .add({
        name: form.name.value,
        question: form.question.value,
        answer: form.answer.value,
      })
      .then((docRef) => {
        console.log("Your question has been submitted!!!");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

    (form.name.value = ""),
      (form.question.value = ""),
      (form.answer.value = "");
  }
});
//getting all students
// db.collection("students")
//   .get()
//   .then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       allQuestins.innerHTML += `<div class="solution-section" data-id=${
//         doc.id
//       }><h5>${doc.data().name}</h5>Question:<p>${
//         doc.data().question
//       }<p/>Answer:<p>${
//         doc.data().answer
//       }</p></br></br><button class="btn btn-danger btn-sm">delete</button><span class="btn btn-info btn-sm">Reply</span></div>`;
//       console.log(`${doc.id} => ${doc.data()}`);
//     });
//   });

//real time databses
db.collection("students").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    console.log(change.type);
    if (change.type === "added") {
      allQuestins.innerHTML += `<div class="solution-section" data-id=${
        change.doc.id
      }><h5>${change.doc.data().name}</h5>Question:<p>${
        change.doc.data().question
      }<p/>Answer:<p>${
        change.doc.data().answer
      }</p><button class="btn btn-danger btn-sm">delete</button><span class="btn btn-info btn-sm" id="myBtn">Edit</span></div>`;
      console.log(`${change.doc.id} => ${change.doc.data()}`);
    }
    if (change.type === "removed") {
      let div = document.querySelector(`[data-id='${change.doc.id}']`);
      divUsers.removeChild(div);
    }
    if (change.type === "modified") {
      let div = document.querySelector(`[data-id='${change.doc.id}']`);
      divUsers.removeChild(div);
      allQuestins.innerHTML += `<div class="solution-section" data-id=${
        change.doc.id
      }><h5>${change.doc.data().name}</h5>Question:<p>${
        change.doc.data().question
      }<p/>Answer:<p>${
        change.doc.data().answer
      }</p><button class="btn btn-danger btn-sm">delete</button><span class="btn btn-info btn-sm" id="myBtn">Edit</span></div>`;
      console.log(`${change.doc.id} => ${change.doc.data()}`);
    }
  });
});

solutionSection.addEventListener("click", (e) => {
  console.log(e.target.parentElement);
  let id = e.target.parentElement.getAttribute("data-id");
  if (e.target.tagName === "BUTTON") {
    console.log(id);
    db.collection("students")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }
  if (e.target.tagName === "SPAN") {
    modal.style.display = "block";
    importantId.value = id;
    console.log(importantId.value);
    db.collection("students")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (id === doc.id) {
            (formUpdate.name.value = doc.data().name),
              (formUpdate.question.value = doc.data().question),
              (formUpdate.answer.value = doc.data().answer);
          }
        });
      });
    (formUpdate.name.value = ""),
      (formUpdate.question.value = ""),
      (formUpdate.answer.value = "");
  }
});

update.addEventListener("click", (e) => {
  e.preventDefault();
  db.collection("students")
    .doc(importantId.value)
    .update({
      name: formUpdate.name.value,
      question: formUpdate.question.value,
      answer: formUpdate.answer.value,

      capital: true,
    })
    .then(() => {
      alert("Document successfully updated!");
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  (formUpdate.name.value = ""),
    (formUpdate.question.value = ""),
    (formUpdate.answer.value = "");
  modal.style.display = "none";
});
