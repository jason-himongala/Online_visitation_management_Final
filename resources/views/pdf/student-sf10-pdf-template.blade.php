<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>School Form 10 Report | E-Cards</title>
    <style>
        @page { margin: 0.2in 0.3in; }
        body {  font-family: Arial, Helvetica, sans-serif; }
        .tbl { width: 100%; border-collapse: collapse; border: 1px solid #333333; font-size: 12px; }
        .tbl td { border: 1px solid #333333; }
        .tbl th { border: 1px solid #333333; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .vertical-middle { vertical-align: middle; }
        .text-top { vertical-align: text-top; }
        .vertical-top { vertical-align: top; }
        .vertical-bottom { vertical-align: bottom; }
        .border-left { border-left: 2px solid black; }
        .underline { border-bottom: 1px solid black; height: 14px; text-indent: 5px; }
        .no-border { border: none; }
        .td-no-border td { border: none; }
        .th-no-border th { border: none; }
        .no-margin { margin: 0px !important; }
        .no-padding { padding: 0px !important; }
        .hr-line-dashed { border-top: 1px dashed #333333; color: #ffffff; background-color: #ffffff; height: 1px; margin: 5px 0; }
        .font-bold { font-weight: bold; }
        .text-uppercase { text-transform: uppercase; }
        .text-lowercase { text-transform: lowercase; }
        .text-capitalize { text-transform: capitalize; }
        .add-space { text-indent: 20px; }
        .tbl-data-header tr td div, .tbl-no-data-header tr td div, .tbl-data-header tr td div div { display: inline-block !important; }
        .td_other_credential div { display: inline-block; }
        .page_break { page-break-before: always; }
        .font-size-10 { font-size: 10px; }
    </style>
</head>
<body>
    <table class="tbl td-no-border no-border" style="margin-bottom: 0px;">
        <tr>
            <td colspan="3" class="text-left" style="font-size: 10px; padding-bottom: 5px;">SF 10 - JHS</td>
        </tr>
        <tr>
            <td class="vertical-top text-left" style="width: 20%; margin-bottom: 0px;">
                <img src="{{ $ecard_logo_deped }}" style="width: 70px; margin-left: 40px;">	
            </td>
            <td style="width: 60%; margin-bottom: 0px;" class="text-center">
                <p style="margin-bottom: 2px;">
                    Republic of the Philippines
                    <br>
                    Department of Education
                </p>
                <h3 style="margin: 0px;">
                    Learner Permanent Record for Junior High School (SF10-JHS)
                </h3>
                <p style="margin-top: 2px; margin-bottom: 0px;">
                    <i>(Formerly Form 137)</i>
                </p>
            </td>
            <td class="vertical-top text-right" style="width: 20%; margin-bottom: 0px;">
                <img src="{{ $ecard_logo_deped2 }}" style="width: 80px; margin-right: 40px;">	
            </td>
        </tr>		
    </table>

    <table class="tbl no-border th-no-border td-no-border" style="margin-bottom: 10px; margin-top: 0px;">
        <tr>
            <th class="text-center" colspan="8" style="background-color: #f0c784;">LEARNER'S INFORMATION</th>
        </tr>
        <tr>
            <td style="width: 12%">LAST NAME:</td>
            <td style="width: 13%;"><u><strong>{{ $data['student_info']['lastname'] ?? '' }}</strong></u></td>
            <td style="width: 12%;">FIRST NAME:</td>
            <td style="width: 13%;"><u><strong>{{ $data['student_info']['firstname'] ?? '' }}</strong></u></td>
            <td style="width: 18%;">NAME EXTN. (Jr, I, II):</td>
            <td style="width: 8%; padding-right: 10px;"><div style="border-bottom: 1px solid #000; width: 100%; height: 12px;"></div></td>
            <td style="width: 12%;">Middle Name: </td>
            <td style="width: 12%;"><u><strong>{{ $data['student_info']['middlename'] ?? '' }}</strong></u></td>
        </tr> 
        <tr>
            <td colspan="8">
                <table class="tbl no-border td-no-border th-no-border">
                    <tr>
                        <td colspan="2" style="width: 14%;">Learner Reference Number:</td>
                        <td><u><strong>{{ $data['student_info']['lrn'] ?? '' }}</strong></u></td>
                        <td style="width: 18%;">Birthdate(mm/dd/yyy):</td>
                        <td colspan="2"><u><strong>{{ $data['student_info']['birthdate'] ?? '' }}</strong></u></td>
                        <td style="width: 5%;">Sex:</td>
                        <td><u><strong>{{ $data['student_info']['gender'] ?? '' }}</strong></u></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table class="tbl no-border th-no-border" style="margin-bottom: 2px;">
        <tr>
            <th class="text-center" colspan="6" style="background-color: #f0c784;">ELIGIBILITY FOR JHS ENROLMENT</th>
        </tr>
    </table>
    <table class="tbl th-no-border td-no-border" style="border-width: 2px;">
        <tr>
            <td style="padding-top: 5px;" class="text-right">
                <input type="checkbox" style="color: blue"
                    {{ isset($data['eligibility_info']['elementary_school_completer_status']) && $data['eligibility_info']['elementary_school_completer_status'] == 1 ? 'checked' : '' }}>						
            </td>
            <td style="padding-top: 5px;">Elementary School Completer</td>
            <td style="padding-top: 5px;" class="text-right">General Average:</td>
            <td style="padding-top: 5px; padding-left: 5px;">
                <u>
                    <strong>{{ $data['eligibility_info']['general_average'] ?? '' }}</strong>
                </u>
            </td>
            <td></td>
            <td style="padding-top: 5px;">Citation: (If any)</td>
            <td style="padding-top: 5px;">
                <div style="border-bottom: 1px solid #000; width: 100%; height: 12px;">
                    <strong>{{ $data['eligibility_info']['citation_if_any'] ?? '' }}</strong>
                </div>
            </td>
        </tr>
        <tr>
            <td></td>
            <td>Name of Elementary School:</td>
            <td class="text-right">
                <u>
                    <strong>{{ $data['eligibility_info']['name_of_the_elementary_school'] ?? '' }}</strong>
                </u>
            </td>
            <td style="padding-left: 5px;">School ID:</td>
            <td>
                <u>
                    <strong>{{ $data['eligibility_info']['school_id'] ?? '' }}</strong>
                </u>
            </td>
            <td>Address of School:</td>
            <td>
                <u>
                    <strong>{{ $data['eligibility_info']['school_address'] ?? '' }}</strong>
                </u>
            </td>
        </tr>
    </table>
  <table class="tbl no-border th-no-border td-no-border tbl-data-header" style="margin-bottom: 10px;">
    <tr>
        <th class="text-left">Other Credential Presented</th>
    </tr>
    <tr>
        <td style="padding: 0px; padding-top: 5px; margin-top: 10px;">
            <input type="checkbox" style="color: blue;"
                {{ isset($data['profile_other_credencial_presented']['pept_passer_rating_status']) && $data['profile_other_credencial_presented']['pept_passer_rating_status'] == 1 ? 'checked' : '' }}>
            PEPT Passer
            &nbsp; &nbsp; &nbsp; &nbsp;
            Rating:
            <div style="border-bottom: 1px solid #000000; height: 13px; width: 50px;">
                <u>
                    <strong>{{ $data['profile_other_credencial_presented']['pept_passer_rating'] ?? '' }}</strong>
                </u>
            </div>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <input type="checkbox" style="color: blue"
                {{ isset($data['profile_other_credencial_presented']['als_a_e_passer_rating_status']) && $data['profile_other_credencial_presented']['als_a_e_passer_rating_status'] == 1 ? 'checked' : '' }}>
            &nbsp;
            ALS A & E Passer
            &nbsp; &nbsp;
            Rating:
            <div style="border-bottom: 1px solid #000000; height: 13px; width: 50px;">
                <u>
                    <strong>{{ $data['profile_other_credencial_presented']['als_a_e_passer_rating'] ?? '' }}</strong>
                </u>
            </div>
            <input type="checkbox" style="color: blue"
                {{ isset($data['profile_other_credencial_presented']['others_status']) && $data['profile_other_credencial_presented']['others_status'] == 1 ? 'checked' : '' }}>
            &nbsp; &nbsp;
            Others (Pls. Specify):
            <div style="border-bottom: 1px solid #000000; height: 13px; width: 50px;">
                <strong>{{ $data['profile_other_credencial_presented']['others'] ?? '' }}</strong>
            </div>
        </td>
    </tr>
    <tr>
        <td>
            Date of Examination/Assessment (mm/dd/yyyy):
            <div style="border-bottom: 1px solid #000000; height: 13px; width: 100px;">
                <strong>{{ $data['profile_other_credencial_presented']['date_of_examination'] ?? '' }}</strong>
            </div>
            Name and Address of Testing Center:
            <div style="border-bottom: 1px solid #000000; height: 13px; width: 140px;">
                <strong>{{ $data['profile_other_credencial_presented']['name_and_address_of_testing_center'] ?? '' }}</strong>
            </div>
        </td>
    </tr>
</table>
    
    <table class="tbl no-border td-no-border th-no-border" style="margin-bottom: 2px;">
        <tr>
            <th class="text-center" colspan="10" style="padding-bottom: 2px;">
                <div style="background-color: #f0c784;">
                    SCHOLASTIC RECORD
                </div>
            </th>
        </tr>
    </table>

    {{-- Page 1: Grades 7 & 8 and certification --}}
    @php $firstGroup = collect($data['scholastic_record'])->take(2); @endphp
    @foreach($firstGroup as $section)
    <div style="page-break-inside: avoid;">
        <table class="tbl td-no-border th-no-border tbl-data-header" style="margin-bottom: 0px; border-width: 2px; border-bottom: 0px">
            <tr>
                <td style="padding-top: 5px !important;">
                    School:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['school_name'] ?? 'ANTICALA NATIONAL HIGH SCHOOL' }}</strong>
                    </div>
                    School ID:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['school_id'] ?? '304765' }}</strong>
                    </div>
                    District:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['district'] ?? 'ANTICALA' }}</strong>
                    </div>
                    Division:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['division'] ?? 'BUTUAN CITY DIVISION' }}</strong>
                    </div>
                    Region:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['region'] ?? 'CARAGA' }}</strong>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    Classified as Grade:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['grade_level'] ?? '' }}</strong>
                    </div>
                    Section:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['section_name'] ?? '' }}</strong>
                    </div>
                    School Year:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['school_year'] ?? '' }}</strong>
                    </div>
                    Adviser/Teacher:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['adviser_name'] ?? '' }}</strong>
                    </div>
                    Signature:<div style="font-size: 10px; border-bottom: 1px solid #333333; width: 50px; height: 14px;"></div>
                </td>
            </tr>
        </table>

        <table class="tbl" style="margin-bottom: 5px; border-width: 2px;">
            <thead>
                <tr>
                    <th rowspan="2" colspan="2" class="text-center">LEARNING AREAS</th>
                    <th colspan="4" class="text-center">Quarterly Rating</th>
                    <th rowspan="2" class="text-center">Final Rating</th>
                    <th rowspan="2" class="text-center">Remarks</th>
                </tr>
                <tr>
                    <th class="text-center">1</th>
                    <th class="text-center">2</th>
                    <th class="text-center">3</th>
                    <th class="text-center">4</th>
                </tr>
            </thead>
            <tbody>
                @foreach($section['subjects'] as $subject)
                <tr>
                    <td colspan="2">{{ $subject['subject_name'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['q1'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['q2'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['q3'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['q4'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['final_grade'] ?? '' }}</td>
                    <td class="text-center" style="color: {{ (strtolower($subject['remark'] ?? '') == 'passed') ? 'green' : ((strtolower($subject['remark'] ?? '') == 'failed') ? 'red' : 'black') }};">
                        {{ $subject['remark'] ?? '' }}
                    </td>
                </tr>
                @endforeach
              
                <tr>
                    <td colspan="2"></td>
                    <td colspan="4" class="text-center font-bold">General Average</td>
                    <td class="text-center font-bold">{{ number_format((float) $section['final_general_average'], 2) }}</td>
                    <td class="text-center font-bold" style="color: {{ (strtolower($section['final_remark']) == 'passed') ? 'green' : 'red' }};">
                        {{ $section['final_remark'] }}
                    </td>
                </tr>
                <tr>
                    <td colspan="8" style="background-color: #f0c784; height: 3px;"></td>
                </tr>
                <tr>
                    <td class="font-bold text-center">Remedial Classes</td>
                    <td colspan="7" class="font-bold">Conducted from (mm/dd/yyyy) _______________________ to (mm/dd/yyyy) _______________________</td>
                </tr>
                <tr>
                    <td class="font-bold text-center">Learning Areas</td>
                    <td class="font-bold text-center">Final Rating</td>
                    <td colspan="3" class="font-bold text-center">Remedial Class Mark</td>
                    <td colspan="2" class="font-bold text-center">Recomputed Final Grade</td>
                    <td class="font-bold text-center">Remarks</td>
                </tr>
                <tr>
                    <td style="height: 12px;"></td>
                    <td></td>
                    <td colspan="3"></td>
                    <td colspan="2"></td>
                    <td></td>
                </tr>
                <tr>
                    <td style="height: 12px;"></td>
                    <td></td>
                    <td colspan="3"></td>
                    <td colspan="2"></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
    @endforeach

    <table class="tbl td-no-border th-no-border tbl-data-header" style="margin-bottom: 0px; border-width: 2px;">
        <tr>
            <td colspan="6" style="padding-left: 5px;">
                <h1 style="font-size: 12pt;text-align: center; margin-top: 1px; margin-bottom: 2px;">CERTIFICATION</h1>
                <div>
                    I CERTIFY that is a true record of 
                    <strong>
                        <u>{{ $data['student_info']['fullname'] ?? '' }}</u>
                    </strong> 
                    with LRN 
                    <strong><u>{{ $data['student_info']['lrn'] ?? '' }}</u></strong>
                    and that he/she is for elligible for admission to Grade:<u><strong></strong></u> <div style="width: 10px; height: 12px; border-bottom: 1px solid #000;"></div>.
                    <br>
                    Name of School: 
                    <strong><u>{{ $firstGroup->last()['school_info']['school_name'] ?? '' }}</u></strong> 
                    School ID: <strong><u>{{ $firstGroup->last()['school_info']['school_id'] ?? '' }}</u></strong> 
                    Last School Year Attended: <div style="width: 100px; height: 12px; border-bottom: 1px solid #000;"></div>.
                </div>
            </td>
        </tr>
        <tr>
            <td style="width: 2%;"></td>
            <td style="border-bottom: 1px solid #333333; width: 30%; padding-top: 20px;"></td>
            <td style="width: 2%; padding-top: 20px;"></td>
            <td style="border-bottom: 1px solid #333333; width: 40%; padding-top: 20px;"></td>
            <td style="width: 2%; padding-top: 20px;"></td>
            <td style="padding-top: 20px; width: 24%;"></td>
        </tr>
        <tr>
            <td style="width: 2%;"></td>
            <td class="text-center">Date</td>
            <td></td>
            <td class="text-center">Name of Principal/School Head over Printed Name</td>
            <td></td>
            <td class="text-center">(Affix School Seal here)</td>
        </tr>
    </table>

    <div class="page_break"></div>

    {{-- Page 2: Grades 9 & 10 and certification --}}

    <p style="margin: 0px; font-size: 10px;">SF 10 - JHS</p>
    @php $secondGroup = collect($data['scholastic_record'])->slice(2, 2); @endphp
    @foreach($secondGroup as $section)
    <div style="page-break-inside: avoid;">
        <table class="tbl td-no-border th-no-border tbl-data-header" style="margin-bottom: 0px; border-width: 2px; border-bottom: 0px">
            <tr>
                <td style="padding-top: 5px !important;">
                    School:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['school_name'] ?? 'ANTICALA NATIONAL HIGH SCHOOL' }}</strong>
                    </div>
                    School ID:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['school_id'] ?? '304765' }}</strong>
                    </div>
                    District:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['district'] ?? 'ANTICALA' }}</strong>
                    </div>
                    Division:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['division'] ?? 'BUTUAN CITY DIVISION' }}</strong>
                    </div>
                    Region:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['region'] ?? 'CARAGA' }}</strong>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    Classified as Grade:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['grade_level'] ?? '' }}</strong>
                    </div>
                    Section:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['section_name'] ?? '' }}</strong>
                    </div>
                    School Year:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['school_year'] ?? '' }}</strong>
                    </div>
                    Adviser/Teacher:
                    <div style="font-size: 10px; border-bottom: 1px solid #333333;">
                        <strong>{{ $section['school_info']['adviser_name'] ?? '' }}</strong>
                    </div>
                    Signature:<div style="font-size: 10px; border-bottom: 1px solid #333333; width: 50px; height: 14px;"></div>
                </td>
            </tr>
        </table>

        <table class="tbl" style="margin-bottom: 5px; border-width: 2px;">
            <thead>
                <tr>
                    <th rowspan="2" colspan="2" class="text-center">LEARNING AREAS</th>
                    <th colspan="4" class="text-center">Quarterly Rating</th>
                    <th rowspan="2" class="text-center">Final Rating</th>
                    <th rowspan="2" class="text-center">Remarks</th>
                </tr>
                <tr>
                    <th class="text-center">1</th>
                    <th class="text-center">2</th>
                    <th class="text-center">3</th>
                    <th class="text-center">4</th>
                </tr>
            </thead>
            <tbody>
                @foreach($section['subjects'] as $subject)
                <tr>
                    <td colspan="2">{{ $subject['subject_name'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['q1'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['q2'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['q3'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['q4'] ?? '' }}</td>
                    <td class="text-center">{{ $subject['final_grade'] ?? '' }}</td>
                    <td class="text-center" style="color: {{ (strtolower($subject['remark'] ?? '') == 'passed') ? 'green' : ((strtolower($subject['remark'] ?? '') == 'failed') ? 'red' : 'black') }};">
                        {{ $subject['remark'] ?? '' }}
                    </td>
                </tr>
                @endforeach
              
                <tr>
                    <td colspan="2"></td>
                    <td colspan="4" class="text-center font-bold">General Average</td>
                    <td class="text-center font-bold">{{ number_format((float) $section['final_general_average'], 2) }}</td>
                    <td class="text-center font-bold" style="color: {{ (strtolower($section['final_remark']) == 'passed') ? 'green' : 'red' }};">
                        {{ $section['final_remark'] }}
                    </td>
                </tr>
                <tr>
                    <td colspan="8" style="background-color: #f0c784; height: 3px;"></td>
                </tr>
                <tr>
                    <td class="font-bold text-center">Remedial Classes</td>
                    <td colspan="7" class="font-bold">Conducted from (mm/dd/yyyy) _______________________ to (mm/dd/yyyy) _______________________</td>
                </tr>
                <tr>
                    <td class="font-bold text-center">Learning Areas</td>
                    <td class="font-bold text-center">Final Rating</td>
                    <td colspan="3" class="font-bold text-center">Remedial Class Mark</td>
                    <td colspan="2" class="font-bold text-center">Recomputed Final Grade</td>
                    <td class="font-bold text-center">Remarks</td>
                </tr>
                <tr>
                    <td style="height: 12px;"></td>
                    <td></td>
                    <td colspan="3"></td>
                    <td colspan="2"></td>
                    <td></td>
                </tr>
                <tr>
                    <td style="height: 12px;"></td>
                    <td></td>
                    <td colspan="3"></td>
                    <td colspan="2"></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
    @endforeach

    <p style="margin: 0px; font-size: 10px;">For Transfer Out/JHS Completer Only</p>
    <table class="tbl td-no-border th-no-border tbl-data-header" style="margin-bottom: 0px; border-width: 2px;">
        <tr>
            <td colspan="6" style="padding-left: 5px;">
                <h1 style="font-size: 12pt;text-align: center; margin-top: 1px; margin-bottom: 2px;">CERTIFICATION</h1>
                <div>
                    I CERTIFY that is a true record of 
                    <strong>
                        <u>{{ $data['student_info']['fullname'] ?? '' }}</u>
                    </strong> 
                    with LRN 
                    <strong><u>{{ $data['student_info']['lrn'] ?? '' }}</u></strong>
                    and that he/she is for elligible for admission to Grade:<u><strong></strong></u> <div style="width: 10px; height: 12px; border-bottom: 1px solid #000;"></div>.
                    <br>
                    Name of School: 
                    <strong><u>{{ $secondGroup->last()['school_info']['school_name'] ?? '' }}</u></strong> 
                    School ID: <strong><u>{{ $secondGroup->last()['school_info']['school_id'] ?? '' }}</u></strong> 
                    Last School Year Attended: <div style="width: 100px; height: 12px; border-bottom: 1px solid #000;"></div>.
                </div>
            </td>
        </tr>
        <tr>
            <td style="width: 2%;"></td>
            <td style="border-bottom: 1px solid #333333; width: 30%; padding-top: 20px;"></td>
            <td style="width: 2%; padding-top: 20px;"></td>
            <td style="border-bottom: 1px solid #333333; width: 40%; padding-top: 20px;"></td>
            <td style="width: 2%; padding-top: 20px;"></td>
            <td style="padding-top: 20px; width: 24%;"></td>
        </tr>
        <tr>
            <td style="width: 2%;"></td>
            <td class="text-center">Date</td>
            <td></td>
            <td class="text-center">Name of Principal/School Head over Printed Name</td>
            <td></td>
            <td class="text-center">(Affix School Seal here)</td>
        </tr>
    </table>
    <p style="margin:0px; font-size: 10px;">(May add Certification box if needed)</p>
</body>
</html>