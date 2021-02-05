let form = document.querySelector("form");
let allQuestins = document.querySelector("#allQuestions");
let solutionSection = document.querySelector(".main-solution-section");
let update = document.querySelector("#update");
let importantId = document.querySelector("#importantId");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("clicked");
  db.collection("students")
    .add({
      name: form.name.value,
      question: form.question.value,
      answer: form.answer.value,
    })
    .then((docRef) => {
      alert("Your question has been submitted!!!");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
});

db.collection("students")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      allQuestins.innerHTML += `<div class="solution-section" data-id=${
        doc.id
      }><h5>${doc.data().name}</h5>Question:<p>${
        doc.data().question
      }<p/>Answer:<p>${
        doc.data().answer
      }</p></br></br><button class="btn btn-danger btn-sm">delete</button><span class="btn btn-info btn-sm">Reply</span></div>`;
      console.log(`${doc.id} => ${doc.data()}`);
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
    }
  }
});

update.addEventListener("click", (e) => {
  var washingtonRef = db.collection("students").doc(importantId.value);

  // Set the "capital" field of the city 'DC'
  return washingtonRef
    .update({
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
