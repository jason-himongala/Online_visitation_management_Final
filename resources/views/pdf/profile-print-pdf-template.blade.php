<!DOCTYPE html>
<html lang="en">

<head>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Student Report | E-Cards</title>

	<link rel="icon" type="image/png" href="https://ecardci.fsuumoesis.com/assets/img/company/company.png">

	<style type="text/css">
		@page {
			margin: 0.5in 0.5in 0.5in 0.5in;
		}

		body {
			font-family: Arial, Helvetica, sans-serif;
		}

		.tbl {
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #333333;
			font-size: 12px;
		}

		.tbl td {
			padding: 5px;
			border: 1px solid #333333;
		}

		.tbl th {
			padding: 5px;
			border: 1px solid #333333;
		}

		.text-center {
			text-align: center;
		}

		.text-right {
			text-align: right;
		}

		.text-left {
			text-align: left;
		}

		.vertical-middle {
			vertical-align: middle;
		}

		.text-top {
			vertical-align: text-top;
		}

		.vertical-top {
			vertical-align: top;
		}

		.vertical-bottom {
			vertical-align: bottom;
		}

		.border-left {
			border-left: 2px solid black;
		}

		.underline {
			border-bottom: 1px solid black;
			height: 14px;
			text-indent: 5px;
		}

		.no-border {
			border: none;
		}

		.td-no-border td {
			border: none;
		}

		.th-no-border th {
			border: none;
		}

		.no-margin {
			margin: 0px !important;
		}

		.no-padding {
			padding: 0px !important;
		}

		.hr-line-dashed {
			border-top: 1px dashed #333333;
			color: #ffffff;
			background-color: #ffffff;
			height: 1px;
			margin: 20px 0;
		}
	</style>

</head>

<body class="white-bg">

	<h2 class="text-center">Student Registered Info</h2>
	<div class="hr-line-dashed"></div>
	<table class="tbl td-no-border no-border">
		<tr>
			<td class="text-left vertical-top" style="width: 15%; padding-left: 70px; text-align: right;">
				<img src="{{$ecard_logo_deped}}" style="width: 70px;">
			</td>
			<td style="width: 70%;" class="text-center">
				<h3 class="no-margin" style="font-weight: 100;">Republic of the Philippines</h3>
				<h3 class="no-margin" style="font-weight: 100;">Department of Education</h3>
				<h3 class="no-margin" style="font-weight: 100;">CARAGA ADMINISTRATIVE REGION</h3>
				<h3 class="no-margin" style="font-weight: 100;">Division of Butuan City</h3>
				<h2 style="margin-bottom: 0px;margin-top: 5px;"><strong>ANTICALA NATIONAL HIGH SCHOOL</strong></h2>
				<h3 style="font-weight: 100; margin-top: 0px; padding-top: 0px;">Anticala, Butuan City</h3>
			</td>
			<td class="text-right vertical-top" style="width: 15%;">
				<img src="{{$ecard_logo}}" style="width: 80px; padding-right: 60px;">
			</td>
		</tr>
	</table>

	<table class="tbl td-no-border no-border th-no-border" style="border-bottom: 1px solid #333333;">
		<tr>
			<th style="border-bottom: 1px solid #333333; font-size: 1.50em;" class="text-left" colspan="4">Basic
				Information</th>
		</tr>
		<tr>
			<td colspan="4" style="border-bottom: 1px solid #333333;"><b>Learner's References Number(LRN):</b>
				<u>{{$data->lrn ?? 'No LRN'}}</u>
			</td>
		</tr>
		<tr style="border-bottom: 1px solid #333333;">
			<td><b>Student Name:</b> <u>{{$data->firstname ?? ''}}</u></td>
			<td><b>Sex:</b> <u>{{$data->gender ?? ''}}</u></td>
			<td><b>Birthdate:</b> <u>{{$data->birthdate ?? ''}}</u></td>
			<td><b>Age:</b> <u>{{$data->age ?? ''}}</u></td>
		</tr>
		<tr>
			<th style="border-bottom: 1px solid #333333;" class="text-left" colspan="4">Address</u> </th>
		</tr>
		<tr>
			<td><b>Street/Purok:</b> <u>{{$data->profile_address->purok ?? ''}}</u></td>
			<td><b>Brgy:</b> <u>{{$data->profile_address->barangay->barangay  ?? ''}}</u></td>
			<td><b>City:</b> <u>{{$data->profile_address->city->city ?? ''}}</u></td>
			<td><b>Province:</b> <u>{{$data->profile_address->province->province ?? ''}}</u></td>
			{{-- <td><b>Region:</b> <u>{{$data->profile_address->region->region}}</u></td> --}}

		</tr>
	</table>
	<br>
	<table class="tbl td-no-border no-border th-no-border" style="border-bottom: 1px solid #333333;">
		<tr>
			<th style="border-bottom: 1px solid #333333; font-size: 1.50em;" class="text-left" colspan="4">Other
				Information</th>
		</tr>
		<tr style="border-bottom: 1px solid #333333;">
			<td><b>Mother Tongue:</b> <u>{{$data->profile_native_languages->first()->native_language->language ?? ''}}</u></td>
			<td><b>IP:</b> <u>{{$data->indigenous_people->indigenous_people ?? ''}}</u></td>
			<td><b>Religion:</b> <u>{{$data->religion->religion ?? ''}}</u></td>
			<td></td>
		</tr>
		<tr>
			<th style="border-bottom: 1px solid #333333;" class="text-left" colspan="4">Father's Information</th>
		</tr>
		<tr style="border-bottom: 1px solid #333333;">
			<td><b>Firstname:</b> <u>{{$data->profile_guardian_father->firstname ?? ''}}</u></td>
			<td><b>Middlename:</b> <u>{{$data->profile_guardian_father->middlename ?? ''}}</u></td>
			<td><b>Lastname:</b> <u>{{$data->profile_guardian_father->lastname ?? ''}}</u></td>
			<td><b>Extension Name:</b> <u>{{$data->profile_guardian_father->name_ext ?? ''}}</u></td>
		</tr>
		<tr>
			<th style="border-bottom: 1px solid #333333;" class="text-left" colspan="4">Mother's Information</th>
		</tr>
		<tr style="border-bottom: 1px solid #333333;">
			<td><b>Firstname:</b> <u>{{$data->profile_guardian_mother->firstname ?? ''}}</u></td>
			<td><b>Middlename:</b> <u>{{$data->profile_guardian_mother->middlename ?? ''}}</u></td>
			<td><b>Lastname:</b> <u>{{$data->profile_guardian_mother->lastname ?? ''}}</u></td>
			<td><b>Extension Name:</b> <u>{{$data->profile_guardian_mother->name_ext ?? ''}}</u></td>
		</tr>
		<tr>
			<td><b>Guardian Name:</b> <u>{{$data->guardian_relationship_if_no_parent->firstname ?? ''}} {{$data->guardian_relationship_if_no_parent->lastname ?? ''}}</u></td>
			<td><b>Guardian Relationship:</b> <u>{{$data->guardian_relationship_if_no_parent->relationship ?? ''}}</u></td>
			<td><b>Contact no of parent or guardian:</b> <u>{{$data->guardian_relationship_if_no_parent->contact_no ?? ''}}</u>
			</td>
			<td><b>Remarks:{{$data->guardian_relationship_if_no_parent->remarks ?? ''}}</b> <u></u></td>
		</tr>
	</table>
	<br>
	<table class="tbl td-no-border no-border th-no-border" style="border-bottom: 1px solid #333333;">
		<tr>
			<th style="border-bottom: 1px solid #333333; font-size: 1.50em;" class="text-left" colspan="3">Eligibility
				for JHS Enrolment</th>
		</tr>
					<tr style="border-bottom: 1px solid #333333;">
				<td>
					<b>Elementary School Completer Checkbox:</b>
					@if(optional($data->profile_school_attended)->elementary_school_completer_status == 1 ?? false)
						<input type="checkbox" id="scales" name="scales" checked />
					@else
						<input type="checkbox" id="scales"  />
					@endif
				</td>
				<td><b>Name of the elementary school:</b> <u>{{$data->profile_school_attended->name_of_the_elementary_school ?? ''}}</u></td>
				<td><b>General average:</b> <u>{{$data->profile_school_attended->general_average ?? ''}}</u></td>
			</tr>
			<tr style="border-bottom: 1px solid #333333;">
				<td><b>School ID:</b> <u>{{$data->profile_school_attended->school_id ?? ''}}</u></td>
				<td><b>Address:</b> <u>{{$data->profile_school_attended->address ?? ''}}</u></td>
				<td><b>Citation if Any:</b> <u>{{$data->profile_school_attended->citation_if_any ?? ''}}</u></td>
			</tr>
			</table>
	<br>
	<table class="tbl td-no-border no-border th-no-border" style="border-bottom: 1px solid #333333;">
		<tr>
			<th style="border-bottom: 1px solid #333333; font-size: 1.50em;" class="text-left" colspan="3">Other
				Credential Presented</th>
		</tr>
					<tr style="border-bottom: 1px solid #333333;">
				<td>
					<b>PEPT Passer Rating:</b>
						@if(optional($data->profile_other_credencial_presented)->pept_passer_rating_status == 1 ?? false)
						<input type="checkbox" id="scales" name="scales" checked />
					@else
						<input type="checkbox" id="scales"  />
					@endif
				</td>
				<td>
					<b>ALS A & E Passer Rating:</b>
					@if(optional($data->profile_other_credencial_presented)->als_a_e_passer_rating_status == 1 ?? false)
						<input type="checkbox" id="scales" name="scales" checked />
					@else
						<input type="checkbox" id="scales"  />
					@endif
				</td>
				<td>
					<b>Others (Pls. Specify):</b>
						@if(optional($data->profile_other_credencial_presented)->others_status == 1 ?? false)
						<input type="checkbox" id="scales" name="scales" checked />
					@else
						<input type="checkbox" id="scales"  />
					@endif
				</td>
			</tr>
			<tr>
                <td><b>Date of Examination/Assessment (MM/DD/YYYY):</b> {{ \Carbon\Carbon::parse($data->profile_other_credencial_presented->date_of_examination ?? '')->format('m/d/Y') }}</td>
				<td><b>Name and Address of Testing Center:</b> {{$data->profile_other_credencial_presented->name_and_address_of_testing_center ?? ''}}</td>
				<td><b>Principal:</b> {{$data->profile_other_credencial_presented->principal ?? ''}}</td>
			</tr>
			</table>

</body>

</html>