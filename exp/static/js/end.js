window.addEventListener("load", function(){
    let user_id_span = document.querySelector("#user_id");
    user_id_span.textContent = String(Participant.user_id);
});