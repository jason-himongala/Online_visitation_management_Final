<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CERTIFICATE OF APPEARANCE</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            margin: 0 auto;
            max-width: 800px;   
        }
        h1 {
            text-decoration: underline;
            margin-top: 20px;
            font-size: 22px;
        }
        p {
            font-size: 14px;
            margin: 6px 0;
        }
        table {
            width: 60%;
            margin: 15px auto;
            border-collapse: collapse;
            font-size: 14px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: center;
        }
        .signatory {
            margin-top: 40px;
            font-weight: bold;
            font-size: 14px;
        }
    </style>
</head>
<body>

    <div class="header" style="width:100%; margin-bottom:10px;">
        <table style="width:100%; border:none;">
            <tr>


                
                <td style="width:80px; text-align:left; border:none;">
                    <img src="{{$csu_logo}}" alt="Left Logo" style="width:80px;">
                </td>
                <td style="text-align:center; border:none;">
                    <p>Republic of the Philippines</p>
                    <h2 style="color: green; margin: 0; font-size:18px;">CARAGA STATE UNIVERSITY</h2>
                    <p>Ampayon, Butuan City 8600, Philippines</p>
                    <p>Management Information System Office</p>
                </td>
                <td style="width:80px; text-align:right; border:none;">
                    <img src="{{$bagong_pillipinas_logo}}" alt="Right Logo" style="width:80px;">
                </td>
            </tr>
        </table>
    </div>

    <h1>CERTIFICATE OF APPEARANCE</h1>

    <p>This is to certify that the following personnel has attended the<br>
        __________________________ at <b>CARAGA STATE UNIVERSITY (CSU)</b><br>
        on _______________, and actively participated in the proceedings.</p>

    <table>
        <tr>
            <th>NAME</th>
            <th>AGENCY</th>
        </tr>
        <tr>
            <td style="height:30px;">
                {{$data->first()->fullname}}
            </td>
            <td>{{$data->first()->name_of_institution_agency}}</td>
        </tr>
    </table>

    <p>This certificate is hereby provided in adherence to government accounting regulations,<br>
        and for any legal purposes, it may be utilized for.</p>

    <p>Issued this ______________ at Caraga State University, Ampayon, Butuan City.</p>

    <div class="signatory">
        <p>ROLYN C. DAGUIL, PhD<br>
        University President</p>
    </div>

</body>
</html>