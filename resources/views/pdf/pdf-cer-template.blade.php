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
            width: 80%; /* Increased width */
            margin: 15px auto;
            border-collapse: collapse;
            font-size: 14px;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left; /* Changed to left alignment */
        }
        th {
            text-align: center;
            background-color: #f2f2f2;
        }
        .signatory {
            margin-top: 40px;
            font-weight: bold;
            font-size: 14px;
        }
        .logo-cell {
            width: 80px;
            border: none;
        }
        .center-cell {
            border: none;
        }
    </style>
</head>
<body>

    <div class="header" style="width:100%; margin-bottom:10px;">
        <table style="width:100%; border:none;">
            <tr>
                <td class="logo-cell" style="text-align:left;">
                    <img src="{{$csu_logo}}" alt="Left Logo" style="width:80px;">
                </td>
                <td class="center-cell" style="text-align:center;">
                    <p>Republic of the Philippines</p>
                    <h2 style="color: green; margin: 0; font-size:18px;">CARAGA STATE UNIVERSITY</h2>
                    <p>Ampayon, Butuan City 8600, Philippines</p>
                    <p>Management Information System Office</p>
                </td>
                <td class="logo-cell" style="text-align:right;">
                    <img src="{{$bagong_pillipinas_logo}}" alt="Right Logo" style="width:80px;">
                </td>
            </tr>
        </table>
    </div>

    <h1>CERTIFICATE OF APPEARANCE</h1>

   <p>

    This is to certify that the following personnel has attended the<br>
    <span style="border-bottom:1px solid #000; display:inline-block; min-width:200px;">
        <b>{{ $data->first()->visitation_forms->selected_faculty_centered_office_organization_to_visit ?? '' }},</b>
    </span>
    at CARAGA STATE UNIVERSITY (CSU)<br>
    on <span style="border-bottom:1px solid #000; display:inline-block; min-width:200px;">
      <b>
        </b>
    </span>, and actively participated in the proceedings.

</p>

<table>
    <thead>
        <tr>
            <th>VISITOR NAME</th>
            <th>DELEGATES NAME</th>
            <th>AGENCY</th>
        </tr>
    </thead>
    <tbody>
        @forelse($data as $delegate)
            <tr>
                @if ($loop->first)
                    <td rowspan="{{ $data->count() }}">
                        {{ $delegate->visitation_forms->visitation_information->profile->lastname ?? 'N/A' }},
                        {{ $delegate->visitation_forms->visitation_information->profile->firstname ?? '' }}
                    </td>
                @endif
                <td>{{ $delegate->fullname ?? 'N/A' }}</td>

                <td>{{ $delegate->visitation_forms->name_of_institution_agency ?? 'N/A' }}</td>
            </tr>
        @empty
            <tr>
                <td colspan="3" style="text-align:center;">No delegates found</td>
            </tr>
        @endforelse
    </tbody>
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