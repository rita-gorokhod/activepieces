import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { FlowRun, FlowRunStatus } from "@activepieces/shared";
import { formatUtils } from "@/lib/utils";
import { flowRunsApi } from "@/features/flow-runs/lib/flow-runs-api";
import { authenticationSession } from "@/features/authentication/lib/authentication-session";
import { DataTable, DataTableFilter, RowDataWithActions } from "@/components/ui/data-table";
import { CheckIcon } from "lucide-react";
import { flowRunUtils } from "../lib/flow-run-utils";
import { StatusIconWithText } from "@/components/ui/status-icon-with-text";

const columns: ColumnDef<RowDataWithActions<FlowRun>>[] = [
    {
        accessorKey: "flowDisplayName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Flow" />,
        cell: ({ row }) => {
            return <div className="text-left">{row.original.flowDisplayName}</div>
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.original.status;
            const { varient, icon: Icon } = flowRunUtils.getStatusIcon(status);
            return <div className="text-left"><StatusIconWithText icon={Icon} text={formatUtils.convertEnumToHumanReadable(status)} variant={varient} /></div>
        },
    },
    {
        accessorKey: 'startTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Start Time" />,
        cell: ({ row }) => {
            return <div className="text-left">{formatUtils.formatDate(new Date(row.original.startTime))}</div>
        },
    },
    {
        accessorKey: 'duration',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
        cell: ({ row }) => {
            return <div className="text-left">{formatUtils.formatDuration(row.original.duration)}</div>
        },
    }
]

const filters: DataTableFilter[] = [
    {
        type: 'select',
        title: 'Status',
        accessorKey: 'status',
        options: Object.values(FlowRunStatus).filter(status => status !== FlowRunStatus.STOPPED).map(status => {
              return {
                  label: formatUtils.convertEnumToHumanReadable(status),
                  value: status,
                  icon: flowRunUtils.getStatusIcon(status).icon
              }
        }),
        icon: CheckIcon
    }
]


const fetchData = async (params: URLSearchParams) => {
    const status = params.getAll('status') as FlowRunStatus[]
    return flowRunsApi.list({
        projectId: authenticationSession.getProjectId(),
        status,
        cursor: params.get('cursor') ?? undefined,
        limit: parseInt(params.get('limit') ?? '10'),
    })
}

export default function FlowRunsTable() {
    return (
        <div className="container mx-auto py-10 flex-col">
            <div className="flex mb-4">
                <h1 className="text-3xl font-bold">Flow Runs</h1>
                <div className="ml-auto">
                </div>
            </div>
            <DataTable columns={columns}
                fetchData={fetchData}
                filters={filters} />
        </div>
    )
}