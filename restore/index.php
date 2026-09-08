<?php

include 'koneksi.php';

//token device
$token = "WkJLvNgBdd2C741mQMXv";


//fungsi kirim pesan
function Kirimfonnte($token, $data)
{
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.fonnte.com/send',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => array(
            'target' => $data["target"],
            'message' => $data["message"],
        ),
        CURLOPT_HTTPHEADER => array(
            'Authorization: ' . $token
        ),
    ));

    $response = curl_exec($curl);

    curl_close($curl);
    echo $response; //log response fonnte
}

//ambil data user dari database
$res = mysqli_query($db, "SELECT * FROM user");
$row = mysqli_fetch_assoc($res);

$data = [
    "target" => $row["whatsapp"],
    "message" => "Halo " . $row["name"] . ", Terimakasih telah mendaftar di aplikasi kami"
];

//kirim pesan
Kirimfonnte($token, $data);
