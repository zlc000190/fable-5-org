import Header from "@/shared/components/dashboard/header";
import { Table as TableBlock } from "@/shared/blocks/table";
import { Table as TableType } from "@/shared/types/blocks/table";
// import Toolbar from "@/shared/components/blocks/toolbar";
import { Card } from "@/shared/components/ui/card";
import { Crumb, Tip, Toolbar } from "@/shared/types/blocks/base";

interface TableSlotType extends TableType {
  crumb?: Crumb;
  description?: string;
  tip?: Tip;
  toolbar?: Toolbar;
}

export default function ({ ...table }: TableSlotType) {
  return (
    <>
      <Header crumb={table.crumb} />
      <div className="w-full px-4 md:px-8 py-8">
        <h1 className="text-2xl font-medium mb-8">{table.title}</h1>
        {table.description && (
          <p className="text-sm text-muted-foreground mb-8">
            {table.description}
          </p>
        )}
        {table.tip && (
          <p className="text-sm text-muted-foreground mb-8">
            {table.tip.description || table.tip.title}
          </p>
        )}
        {/* {table.toolbar && <Toolbar items={table.toolbar.items} />} */}
        <Card className="overflow-x-auto px-6">
          <TableBlock columns={table.columns ?? []} data={table.data ?? []} />
        </Card>
      </div>
    </>
  );
}
