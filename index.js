let form = document.querySelector("form");
let allQuestins = document.querySelector("#allQuestions");
let solutionSection = document.querySelector(".main-solution-section");
let update = document.querySelector("#update");
let importantId = document.querySelector("#importantId");
const divUsers = document.querySelector(".div-users");

form.addEventListener("submit", (e) => {
  e.preventDefault();
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

  (form.name.value = ""), (form.question.value = ""), (form.answer.value = "");
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
      }</p></br></br><button class="btn btn-danger btn-sm">delete</button><span class="btn btn-info btn-sm">Edit</span></div>`;
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
      }</p></br></br><button class="btn btn-danger btn-sm">delete</button><span class="btn btn-info btn-sm">Edit</span></div>`;
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
    importantId.value = id;
    console.log(importantId.value);
    if (id) {
      db.collection("students")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            (form.name.value = doc.data().name),
              (form.question.value = doc.data().question),
              (form.answer.value = doc.data().answer);
          });
        });
      (form.name.value = ""),
        (form.question.value = ""),
        (form.answer.value = "");
    }
  }
});

update.addEventListener("click", (e) => {
  var washingtonRef = db.collection("students").doc(importantId.value);

  // Set the "capital" field of the city 'DC'
  return washingtonRef
    .update({
      name: form.name.value,
      question: form.question.value,
      answer: form.answer.value,

      capital: true,
    })
    .then(() => {
      alert("Document successfully updated!");
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
});
