<?php

header("Content-Type: application/json");

//Replace with your actual credentials before running
$host = "localhost";
$user = "#####"; 
$pass = "#####";
$dbname = "#####";

$conn=new mysqli($host,$user,$pass,$dbname);

if($conn->connect_error){
    echo json_encode([
        "success"=>false,
        "error"=>"Database connection failed"
    ]);
    exit();
}

$action=$_GET["action"] ?? "";

if($action==="save"){

    $data=json_decode(file_get_contents("php://input"),true);

    if(!$data){
        echo json_encode([
            "success"=>false,
            "error"=>"Invalid request data"
        ]);
        exit();
    }

    $player=$data["player"] ?? "Anonymous";
    $variant=$data["variant"] ?? "";
    $moves=$data["moves"] ?? 0;
    $time=$data["time"] ?? 0;

    if(trim($player)===""){
        $player="Anonymous";
    }

    $stmt=$conn->prepare(
        "INSERT INTO leaderboard(player,variant,moves,solve_time)
         VALUES(?,?,?,?)"
    );

    $stmt->bind_param(
        "ssii",
        $player,
        $variant,
        $moves,
        $time
    );

    if($stmt->execute()){

        echo json_encode([
            "success"=>true,
            "message"=>"Score saved"
        ]);

    }else{

        echo json_encode([
            "success"=>false,
            "error"=>"Could not save score"
        ]);

    }

    $stmt->close();

}

else if($action==="leaderboard"){

    $sql="
        SELECT player,variant,moves,solve_time
        FROM leaderboard
        ORDER BY solve_time ASC,
                 moves ASC,
                 FIELD(variant,'hard','medium','easy')
        LIMIT 10
    ";

    $result=$conn->query($sql);

    if(!$result){

        echo json_encode([
            "success"=>false,
            "error"=>"Could not retrieve leaderboard"
        ]);

        exit();

    }

    $scores=[];

    while($row=$result->fetch_assoc()){

        $scores[]=$row;

    }

    echo json_encode($scores);

}

else{

    echo json_encode([
        "success"=>false,
        "error"=>"Invalid action"
    ]);

}

$conn->close();

?>