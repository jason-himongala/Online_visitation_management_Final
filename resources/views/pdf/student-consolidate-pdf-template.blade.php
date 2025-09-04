<!-- filepath: resources/views/consolidated_report.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consolidated Report</title>
    <style>
        body { font-family: Tahoma, sans-serif; margin: 0; padding: 0; }
        .header { text-align: center; margin-top: 20px; font-size: 15px; }
        .header-2 { text-align: center; margin-top: 10px; font-size: 18px; font-weight: bold; }
        .tbl { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .tbl th, .tbl td { border: 1px solid black; padding: 2px; font-size: 12px; text-align: center; }
        .tbl th { padding: 11px; }
        .info { text-align: center; margin-top: 10px; font-size: 14px; }
    </style>
</head>
<body>

        <table class="no-border th-no-border td-no-border" style="width: 100%; margin-bottom: 10px;">
            <tr>
                <td style="width: 20%; vertical-align: top; text-align: left;">
                    <img src="{{ $ecard_logo_deped ?? '' }}" style="width: 70px; margin-left: 40px;">
                </td>
                <td style="width: 60%; vertical-align: top; text-align: center;">
                    <div class="header">
                        Republic of the Philippines<br>
                        Department of Education<br>
                        Caraga Administrative Region<br>
                        Butuan City Division<br>
                        East Butuan District II
                    </div>
                </td>
                <td style="width: 20%; vertical-align: top; text-align: right;">
                    <img src="{{ $ecard_logo_deped2 ?? '' }}" style="width: 80px; margin-right: 40px;">
                </td>
            </tr>
        </table>

    <div class="header-2">
        ANTICALA NATIONAL HIGH SCHOOL<br>
        Anticala, Butuan City
    </div>

    <div class="header-2" style="margin-top: 20px;">
        CONSOLIDATED REPORT
    </div>

    <div class="tbl" style="margin-top: 50px;">
         @foreach($data as $teacher)
                @if($loop->first)
                    Teacher: <u>{{ $teacher['fullname_subject_adviser'] }}</u> 
                @endif
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;     @if($loop->first)  Section: <u>{{ $teacher['section_name'] }}</u> @endif &nbsp;&nbsp;
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;
                        @if($loop->first)
                  Quarter: <u>
                    @if(Str::startsWith($teacher['quarter_selected'], 'q'))
                        {{ ltrim($teacher['quarter_selected'], 'q') }}
                    @else
                        {{ $teacher['quarter_selected'] }}
                    @endif
                       @endif
                  </u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; @if ($loop->first)
                       Year: <u>{{ $teacher['school_year'] }}</u>
                  @endif

         @endforeach
    </div>

<table class="tbl">
    <thead>
        <tr>
            <th rowspan="2">Student Name</th>
            @foreach(['English', 'Math', 'Science'] as $subject)
                <th rowspan="2">{{ $subject }}</th>
            @endforeach
            <th colspan="5">MAPEH</th>
            @foreach(['Filipino', 'T.L.E', 'Araling Panlipunan (AP)', 'ESP', 'Final'] as $subject)
                <th rowspan="2">
                    @if($subject === 'Araling Panlipunan (AP)')
                        Aral.<br>Pan.
                    @else
                        {{ $subject }}
                    @endif
                </th>
            @endforeach
            <th rowspan="2">Remarks</th>
        </tr>
        <tr>
            @foreach(['Music', 'Arts', 'P.E', 'Health', 'Final'] as $mapeh)
                <th>{{ $mapeh }}</th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach($data as $student)
            <tr>
                <td>{{ $student['fullname'] }}</td>
                @foreach(['English', 'Math', 'Science'] as $subject)
                    <td>
                        {{ optional(collect($student['student_grades'])->firstWhere('subject_name', $subject))['selected_grade'] ?? '-' }}
                    </td>
                @endforeach
                @foreach(['Music', 'Arts', 'P.E', 'Health', 'Final'] as $mapeh)
                    <td>
                        {{ optional(collect($student['student_grades'])->firstWhere('subject_name', $mapeh))['selected_grade'] ?? '-' }}
                    </td>
                @endforeach
                @foreach(['Filipino', 'T.L.E', 'Araling Panlipunan (AP)', 'Edukasyon sa Pagpapakatao (EsP)', 'Final'] as $subject)
                    <td>
                        {{ optional(collect($student['student_grades'])->firstWhere('subject_name', $subject))['selected_grade'] ?? '-' }}
                    </td>
                @endforeach
                {{-- <td>{{ $student['remark'] ?? '-' }}</td> --}}
                  <td style="color: {{ $student['remark'] === 'Passed' ? 'green' : ($student['remark'] === 'Failed' ? 'red' : 'black') }}">
                            {{ $student['remark'] ?? '-' }}
                        </td>
            </tr>
        @endforeach
    </tbody>
</table>
</body>
</html>