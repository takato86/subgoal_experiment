Env.task_info = document.getElementById("task")
Env.task_id = parseInt(Env.task_info.dataset.taskid);
Env.user_id = -1;
Env.task_type = Env.task_info.dataset.tasktype;


function setInfoCookie(){
    setCookie("user_id", Env.user_id);
    setCookie("task_id", Env.task_id);
    setCookie("task_type", Env.task_type);
}
window.addEventListener("beforeunload", setInfoCookie);


window.addEventListener("load", function(){
   if(Env.user_id != -1){
        window.location.href = 'exp/tasks/fourroom/play/description';
   } 
});