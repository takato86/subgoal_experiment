let file = document.querySelector('#file');
let res = document.querySelector('#result');

canvas.width = Env.screen_width;
canvas.height = Env.screen_height;
Participant.subgoals = [];
Participant.task_id = 1; // init()で使用するため暫定で1。

window.addEventListener('resize', ()=>{
    Env.screen_height = window.innerWidth * 0.35;
    Env.screen_width = window.innerWidth * 0.35;
    canvas.screen_width = Env.screen_width;
    canvas.screen_height = Env.screen_height;
});

// File APIに対応しているか確認
if(window.File && window.FileReader && window.FileList && window.Blob) {
    function loadLocalCsv(e) {
        // ファイル情報を取得
        var fileData = e.target.files[0];
        console.log(fileData); // 取得した内容の確認用
 
        // CSVファイル以外は処理を止める
        if(!fileData.name.match('.csv$')) {
            alert('CSVファイルを選択してください');
            return;
        }
 
        // FileReaderオブジェクトを使ってファイル読み込み
        var reader = new FileReader();
        // ファイル読み込みに成功したときの処理
        reader.onload = function() {
            var cols = reader.result.trim().split('\n');
            var data = [];
            for (var i = 0; i < cols.length; i++) {
                data[i] = cols[i].trim().split(',');
            }
            renderSubgoals(data[0], data.slice(1));
        }
        // ファイル読み込みを実行
        reader.readAsText(fileData);
    }
    file.addEventListener('change', loadLocalCsv, false);
 
} else {
    file.style.display = 'none';
    result.innerHTML = 'File APIに対応したブラウザでご確認ください';
}

function renderSubgoals(header, data){
    init();
    const i_x = header.indexOf('x');
    const i_y = header.indexOf('y');
    const i_rad = header.indexOf('rad');
    let x, y, rad;
    for(row of data){
        x = parseFloat(row[i_x]);
        y = parseFloat(row[i_y]);
        rad = parseFloat(row[i_rad]);
        Participant.subgoals.push(new Subgoal(x, y, rad));
    }
    render();
    render_subgoals(is_text=false, alpha=0.2);
}