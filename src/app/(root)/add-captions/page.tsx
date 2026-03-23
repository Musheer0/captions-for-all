import { PlusSignIcon, Warning } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/features/dashboard/page-header";
import AddCaptionView from "@/features/translate-captions/views/add-caption-view";

const page = () => {
  return (
    <div className="flex-1 w-full h-full">
      <PageHeader name="Add Captions To Video">
        <div className="right flex items-center gap-2">
         
          <Button className={"rounded-md"} variant={"destructive"}>
            <HugeiconsIcon icon={Warning} />
                         <span className="hidden sm:flex">             Report Bug
</span>

          </Button>
        </div>
      </PageHeader>
      <AddCaptionView/>
    </div>
  );
};

export default page;
