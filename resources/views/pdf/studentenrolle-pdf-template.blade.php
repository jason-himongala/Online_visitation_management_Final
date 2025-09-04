
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Report Card</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10pt;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 10px;
        }

        .header {
            text-align: center;
            margin-bottom: 10px;
        }

        .form-id {
            text-align: right;
            font-size: 9pt;
            margin-bottom: 5px;
        }

        .school-name {
            font-weight: bold;
            margin: 2px 0;
        }

        .report-title {
            font-weight: bold;
            text-decoration: underline;
            margin: 5px 0;
        }

        .student-info {
            width: 100%;
            margin-bottom: 10px;
        }

        .student-info td {
            padding: 2px 5px;
        }

        .underline {
            border-bottom: 1px solid black;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 9pt;
        }

        th,
        td {
            border: 1px solid black;
            padding: 3px;
            text-align: center;
        }

        .no-border {
            border: none;
        }

        .th-no-border th {
            border: none;
        }

        .td-no-border td {
            border: none;
        }

        .vertical-middle {
            vertical-align: middle;
        }

        .text-left {
            text-align: left;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }
        .rotate { height: 20px; 
            white-space: nowrap; 
        }
		.rotate > div {
            transform: rotate(270deg);
             font-size: 11px;
             }

        .signature-line {
            border-bottom: 1px solid black;
            width: 200px;
            display: inline-block;
            margin: 0 10px;
        }

        .page-break {
            page-break-after: always;
        }

        .indent {
            padding-left: 15px;
        }
       
    </style>
</head>

<body>

    @foreach ($data as $item)
        @php
            // dd(vars: $item);
        @endphp
        <div class="container">
            <div class="form-id" style="vertical-align: top; text-align: left;"> DepEd Form 138-A<br>Revised 2018</div>

             <table class="no-border th-no-border td-no-border" style="width: 100%; margin-bottom: 10px;">
                        <tr>
                            <td style="width: 20%; vertical-align: top; text-align: left;">
                                <img src="{{ $ecard_logo ?? '' }}" style="width: 70px; margin-left: 40px;">
                            </td>
                            <td style="width: 60%; vertical-align: top; text-align: center;">
                                <div class="header">
                                    <div>Republic of the Philippines</div>
                                    <div>Department of Education</div>
                                    <div>Caraga Administrative Region</div>
                                    <div>Division of Butuan City</div>
                                    <div class="school-name">ANTICALA NATIONAL HIGH SCHOOL</div>
                                    <div>Anticala, Butuan City</div>
                                    <div class="report-title">ULAT TUNGKOL SA PAG UNLAD NG MARKA</div>
                                    <div>LRN: <u>{{ $item['lrn'] }}</u></div>
                                </div>
                            </td>
                            <td style="width: 20%; vertical-align: top; text-align: right;">
                                <img src="{{ $ecard_logo_deped ?? '' }}" style="width: 80px; margin-right: 40px;">
                            </td>
                        </tr>
                    </table>

            <table class="student-info no-border">
                <tr>
                    <td width="15%"><strong>Name:</strong></td>
                    <td width="35%" class="underline"><strong>{{ $item['fullname'] ?? '' }}</strong></td>
                    <td width="10%"><strong>Age:</strong></td>
                    <td width="15%" class="underline"><strong>{{ $item['age'] ?? '' }}</strong></td>
                    <td width="10%"><strong>Sex:</strong></td>
                    <td width="15%" class="underline"><strong>{{ $item['gender'] ?? '' }}</strong>
                    </td>
                </tr>
                <tr>
                    <td><strong>Grade:</strong></td>
                    <td class="underline"><strong>{{ $item['grade_level'] ?? '' }}</strong></td>
                    <td><strong>Section:</strong></td>
                    <td class="underline"><strong>{{ $item['section_name'] ?? '' }}</strong></td>
                    <td colspan="2"></td>
                </tr>
                <tr>
                    <td><strong>School Year:</strong></td>
                    <td class="underline"><strong>{{ $item['school_year'] ?? '' }}</strong></td>
                    <td colspan="4"></td>
                </tr>
            </table>

            <table>
                <thead>
                    <tr>
                        <th rowspan="2" width="30%">Learning Areas</th>
                        <th colspan="4">Quarter</th>
                        <th rowspan="2">Final Grade</th>
                        <th rowspan="2">Remarks</th>
                    </tr>
                    <tr>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($item['subjects'] as $subject)
                        <tr>
                            <td class="text-left"><strong>{{ $subject['subject_name'] }}</strong></td>
                            <td>{{ $subject['q1'] }}</td>
                            <td>{{ $subject['q2'] }}</td>
                            <td>{{ $subject['q3'] }}</td>
                            <td>{{ $subject['q4'] }}</td>
                            <td>{{ $subject['final_grade'] }}</td>
                            <td>
                        <span style="color: {{ $subject['remark'] === 'Passed' ? 'green' : ($subject['remark'] === 'Failed' ? 'red' : 'black') }}">
                            {{ $subject['remark'] }}
                        </span>
                           </td>
                        </tr>
                    @endforeach
                </tbody>
                <tfoot>
                    <tr>
                        <td class="text-center" colspan="5"><strong>General Average</strong></td>
                        <td>{{ $item['final_general_average'] }}</td>
                        <td style="color: {{ $item['final_remarks'] === 'Passed' ? 'green' : ($item['final_remarks'] === 'Failed' ? 'red' : 'black') }}">
                            {{ $item['final_remarks'] }}
                        </td>                  
          </tr>
                </tfoot>
            </table>

            <table class="no-border th-no-border">
                <tr>
                    <th width="33%">Descriptions:</th>
                    <th width="33%">Grading Scale:</th>
                    <th width="33%">Remarks:</th>
                </tr>
                <tr>
                    <td class="indent">Outstanding</td>
                    <td class="indent">90-100</td>
                    <td class="indent" style="color: green;">Passed</td>                </tr>
                <tr>
                    <td class="indent">Very Satisfactory</td>
                    <td class="indent">86-89</td>
                  <td class="indent" style="color: green;">Passed</td>
                </tr>
                <tr>
                    <td class="indent">Satisfactory</td>
                    <td class="indent">80-85</td>
                   <td class="indent" style="color: green;">Passed</td>
                </tr>
                <tr>
                    <td class="indent">Fair Satisfactory</td>
                    <td class="indent">76-79</td>
                   <td class="indent" style="color: green;">Passed</td>
                </tr>
                <tr>
                    <td class="indent">Did Not Meet Expectations</td>
                    <td class="indent">Below 75</td>
                    <td class="indent" style="color: red;">Failed</td>
                </tr>
            </table>

            <table class="no-border th-no-border">
                <tr>
                    <td width="20%"><strong>Promoted to:</strong></td>
                    <td class="underline"><strong>Grade 8</strong></td>
                </tr>
                <tr>
                    <td><strong>Lack Units in:</strong></td>
                    <td class="underline"></td>
                </tr>
                <tr>
                    <td><strong>Date:</strong></td>
                    <td class="underline"></td>
                </tr>
            </table>

            <table>
                <thead>

                    <tr>
                        <th colspan="13" class="text-center">REPORT ON ATTENDANCE</th>
                    </tr>
                    <tr>
                        <th width="25%"></th>
                        
                        <th class="rotate"><span>Jun</span></th>
                        <th class="rotate"><span>Jul</span></th>
                        <th class="rotate"><span>Aug</span></th>
                        <th class="rotate"><span>Sep</span></th>
                        <th class="rotate"><span>Oct</span></th>
                        <th class="rotate"><span>Nov</span></th>
                        <th class="rotate"><span>Dec</span></th>
                        <th class="rotate"><span>Jan</span></th>
                        <th class="rotate"><span>Feb</span></th>
                        <th class="rotate"><span>Mar</span></th>
                        <th class="rotate"><span>Apr</span></th>
                        <th>Total</th>

                    </tr>
                </thead>
                @foreach ($item['student_attendance_detail'] as $details)
                <tbody>
                        <tr>
                            <td class="text-left">{{ $details['attendance_type'] }}</td>
                            <td>{{ $details['jun'] }}</td>
                            <td>{{ $details['jul'] }}</td>
                            <td>{{ $details['aug'] }}</td>
                            <td>{{ $details['sep'] }}</td>
                            <td>{{ $details['oct'] }}</td>
                            <td>{{ $details['nov'] }}</td>
                            <td>{{ $details['dec'] }}</td>
                            <td>{{ $details['jan'] }}</td>
                            <td>{{ $details['feb'] }}</td>
                            <td>{{ $details['mar'] }}</td>
                            <td>{{ $details['apr'] }}</td>
                            <td>{{ $details['total'] }}</td>
                            
                        </tr>
                    </tbody>
                    @endforeach
            </table>

            <div class="signature">
                <div style="float: left; width: 45%; text-align: center;">
                        <strong>{{ $item['fullname_subject_adviser_assign'] }}</strong><br>

                    <div class="signature-line"></div><br>

                    ADVISER
                </div>
                 <div style="float: left; width: 45%; text-align: center;">
                                  <strong>MS. JENNY L. BANTILAN, MAED</strong><br>


                    <div class="signature-line"></div><br>

                    PRINCIPAL I
                </div>
                <div style="clear: both;"></div>
            </div>
        </div>
    @endforeach

    {{-- <div class="page-break"></div> --}}


    {{-- <div class="page-break"></div> --}}

    <div class="container">
        <table class="no-border th-no-border">
            <tr>
                <th colspan="2" class="text-center">PARENT/GUARDIAN'S SIGNATURE</th>
            </tr>
            <tr>
                <td width="25%">First Quarter</td>
                <td class="underline"></td>
            </tr>
            <tr>
                <td>Second Quarter</td>
                <td class="underline"></td>
            </tr>
            <tr>
                <td>Third Quarter</td>
                <td class="underline"></td>
            </tr>
            <tr>
                <td>Fourth Quarter</td>
                <td class="underline"></td>
            </tr>
        </table>

        <div style="margin: 20px 0;">
            <div class="text-center"><strong>Certificate of Transfer</strong></div>
            <div style="margin-top: 10px;">
                <strong>Admitted to Grade:___________ Section:_________________________ Eligibility for Admission to
                    Grade:____________________</strong><br>
                Approved:
            </div>
        </div>
    </br>

        <div class="signature">
            <div style="float: left; width: 45%; text-align: center;">
                <strong>{{ $item['fullname_subject_adviser_assign'] }}</strong><br>

               <div class="signature-line"></div><br>
                ADVISER
            </div>
            <div style="float: left; width: 45%; text-align: center;">
                {{-- <strong>{{ $item['fullname_subject_adviser_assign'] }}</strong><br> --}}
                <strong>MS. JENNY L. BANTILAN, MAED</strong><br>

               <div class="signature-line"></div><br>
                 PRINCIPAL I
            </div>
          
            <div style="clear: both;"></div>
        </div>

        <table class="no-border th-no-border" style="margin-top: 30px; width: 100%;">
            <tr>
            <th colspan="4" class="text-center">Cancellation of Eligibility to Transfer</th>
            </tr>
            <tr>
            <td width="20%">Admitted in:</td>
            <td width="30%" class="underline"></td>
            <td width="5%"></td>
            <td width="45%" class="underline"></td>
            </tr>
            <tr>
            <td>Date:</td>
            <td class="underline"></td>
            <td></td>
            <td class="text-center underline"><strong>MS. JENNY L. BANTILAN, MAED</strong></td>
            </tr>
            <tr>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-center">PRINCIPAL I</td>
            </tr>
        </table>

        <table style="margin-top: 20px;">
            <thead>
                <tr>
                    <th colspan="6" class="text-center">REPORT ON LEARNER'S OBSERVED VALUES</th>
                </tr>
                <tr>
                    <th width="20%" rowspan="2" class="text-center">Core Values</th>
                    <th width="50%" rowspan="2" class="text-center">Behavior Statement</th>
                    <th colspan="4" class="text-center">Quarter</th>
                </tr>
                <tr>
                    <th class="text-center">1</th>
                    <th class="text-center">2</th>
                    <th class="text-center">3</th>
                    <th class="text-center">4</th>
                </tr>
            </thead>
            @if (is_array($item['student_rlov_detail']) || is_iterable($item['student_rlov_detail']))
            <tbody>
                    @foreach ($item['student_rlov_detail'] as $detail)
                        <tr>
                            <td rowspan="{{ count($detail['statements']) }}" class="text-center">
                                {{ $detail['rlov_behavior_statement'] }}
                            </td>
                            @foreach ($detail['statements'] as $index => $statement)
                                @if ($index > 0)
                        </tr>
                        <tr>
                    @endif
                    <td>{{ $statement['rlov_behavior_statement_statement'] ?? '' }}</td>
                    <td>{{ $statement['q1'] ?? '' }}</td>
                    <td>{{ $statement['q2'] ?? '' }}</td>
                    <td>{{ $statement['q3'] ?? '' }}</td>
                    <td>{{ $statement['q4'] ?? '' }}</td>
                @endforeach
                </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="6" class="text-center">No data available</td>
                </tr>
            </tbody>
            @endif
        </table>

        <table class="no-border th-no-border" style="margin-top: 10px;">
            <tr>
                <th width="20%" class="text-center">Marking</th>
                <th class="text-left">Non-numerical Rating</th>
            </tr>
            <tr>
                <td class="text-center">AO</td>
                <td class="text-left">Always Observed</td>
            </tr>
            <tr>
                <td class="text-center">SO</td>
                <td class="text-left">Sometimes Observed</td>
            </tr>
            <tr>
                <td class="text-center">RO</td>
                <td class="text-left">Rarely Observed</td>
            </tr>
            <tr>
                <td class="text-center">NO</td>
                <td class="text-left">Not Observed</td>
            </tr>
        </table>

        <div class="text-center" style="margin-top: 20px; font-weight: bold;">
            GOVERNMENT PROPERTY NOT FOR SALE
        </div>
    </div>
</body>

</html>
