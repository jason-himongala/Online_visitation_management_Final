<?php

namespace App\Exports;

use App\Models\VisitaionInformation;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class VisitationInformationExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles, WithTitle
{
    protected $startYear;
    protected $startMonth;
    protected $endYear;
    protected $endMonth;
    protected $isRange;

    public function __construct($startYear, $startMonth, $endYear = null, $endMonth = null)
    {
        $this->startYear = $startYear;
        $this->startMonth = $startMonth;
        $this->endYear = $endYear ?? $startYear;
        $this->endMonth = $endMonth ?? $startMonth;
        $this->isRange = !($this->startYear == $this->endYear && $this->startMonth == $this->endMonth);
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $startDate = Carbon::create($this->startYear, $this->startMonth, 1)->startOfMonth();
        $endDate = Carbon::create($this->endYear, $this->endMonth, 1)->endOfMonth();

        $query = VisitaionInformation::with([
            'profile',
            'appointment_schedule.department'
        ]);

        $query->whereBetween('created_at', [$startDate, $endDate]);

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        $dateRange = $this->isRange
            ? "{$this->startYear}-" . str_pad($this->startMonth, 2, '0', STR_PAD_LEFT) .
            " to {$this->endYear}-" . str_pad($this->endMonth, 2, '0', STR_PAD_LEFT)
            : "{$this->startYear}-" . str_pad($this->startMonth, 2, '0', STR_PAD_LEFT);

        return [
            'ID',
            'Visitor Name',
            'Email',
            'Department',
            'Date & Time',
            'Purpose of Visit',
            'Status',
            'Remarks',
            'Date Created',
            'Date Range: ' . $dateRange,
        ];
    }

    /**
     * @param VisitaionInformation $visitation
     * @return array
     */
    public function map($visitation): array
    {
        return [
            $visitation->id,
            $visitation->profile
                ? $visitation->profile->firstname . ' ' . $visitation->profile->lastname
                : 'N/A',
            $visitation->profile->email ?? 'N/A',
            $visitation->appointment_schedule && $visitation->appointment_schedule->department
                ? $visitation->appointment_schedule->department->department_name
                : 'N/A',
            $visitation->appointment_schedule
                ? $visitation->appointment_schedule->available_time
                : 'N/A',
            $visitation->purpose_of_visit,
            $visitation->status,
            $visitation->remarks,
            $visitation->created_at ? $visitation->created_at->format('Y-m-d H:i:s') : 'N/A',
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        if ($this->isRange) {
            return "Visitations {$this->startYear}-{$this->startMonth} to {$this->endYear}-{$this->endMonth}";
        }
        return "Visitations {$this->startYear}-{$this->startMonth}";
    }
}
