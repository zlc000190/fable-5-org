import { Form as FormBlock } from "@/shared/blocks/form";
import { Form as FormType } from "@/shared/types/blocks/form";
import Header from "@/shared/components/dashboard/header";
import { Card } from "@/shared/components/ui/card";
import { Crumb } from "@/shared/types/blocks/base";

interface FormSlotType extends FormType {
  crumb?: Crumb;
}

export default function ({ ...form }: FormSlotType) {
  return (
    <>
      <Header crumb={form.crumb} />
      <div className="w-full px-4 md:px-8 py-8">
        <h1 className="text-2xl font-medium mb-8">{form.title}</h1>
        <Card className="overflow-x-auto px-6">
          <FormBlock
            fields={form.fields}
            data={form.data}
            passby={form.passby}
            submit={form.submit}
          />
        </Card>
      </div>
    </>
  );
}
