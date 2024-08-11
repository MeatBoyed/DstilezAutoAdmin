import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LeadWithCustomerAndVehicle } from "@/server/util/BusinessLogic";

export default function LeadDialog({
  lead,
  onOpenChange,
  privacyMode,
}: {
  lead: LeadWithCustomerAndVehicle;
  onOpenChange: () => void;
  privacyMode?: boolean;
}) {
  return (
    <Dialog open={!!lead} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{lead.Customer?.name}</DialogTitle>
          <DialogDescription>View details for this lead.</DialogDescription>
        </DialogHeader>
        <div className="grid  gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="email" className="text-right">
              Name
            </Label>
            <div className="col-span-3">{lead.Customer?.name}</div>
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="company" className="text-right">
              Surname
            </Label>
            <div className="col-span-3">{lead.Customer?.surname}</div>
          </div>
          {!privacyMode && (
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">{lead.Customer?.email}</div>
            </div>
          )}
          {!privacyMode && (
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <div className="col-span-3">{lead.Customer?.phoneNumber}</div>
            </div>
          )}
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3">
              <Badge variant={lead.status === "New" ? "outline" : lead.status === "Contacted" ? "secondary" : "default"}>
                {lead.status}
              </Badge>
            </div>
          </div>
        </div>
        <DialogFooter className="">
          <ForwardLead leadId={lead.id} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ForwardLead({ leadId }: { leadId: string }) {
  return (
    <div className="w-full flex justify-center items-center flex-col gap-3">
      <div className="w-full flex justify-center items-center gap-3">
        <Label htmlFor="salesPersonEmail" className="text-right">
          Forward
        </Label>
        <div className="col-span-3">
          <Input id="salesPersonEmail" type="email" placeholder="Sales-person's email" className="" />
        </div>
        <Button variant="default">Send</Button>
      </div>
      <Label htmlFor="salesPersonEmail" className="text-muted-foreground">
        Forward this lead to a sales-person.
      </Label>
    </div>
  );
}
