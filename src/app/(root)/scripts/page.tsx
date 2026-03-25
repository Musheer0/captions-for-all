import { Warning } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/features/dashboard/page-header";

const page = () => {
  return (
    <div className="flex-1 w-full h-full">
      <PageHeader name="Scripts">
        <div className="right flex items-center gap-2">
          <Button className={"rounded-md"} variant={"destructive"}>
            <HugeiconsIcon icon={Warning} />
            Report Bug
          </Button>
        </div>
      </PageHeader>
      <div className="w-full flex-1 flex items-center justify-center">
        <p className="text-5xl font-bold  pt-20">Captions4All Cli Soon...</p>
      </div>
    </div>
  );
};

export default page;
