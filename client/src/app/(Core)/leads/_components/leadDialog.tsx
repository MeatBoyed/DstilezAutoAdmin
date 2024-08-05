import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Lead } from "./leadTable";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function LeadDialog({
  lead,
  onOpenChange,
  privacyMode,
}: {
  lead: Lead;
  onOpenChange: () => void;
  privacyMode?: boolean;
}) {
  return (
    <Dialog open={!!lead} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
          <DialogDescription>View details for this lead.</DialogDescription>
        </DialogHeader>
        <div className="grid  gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="email" className="text-right">
              Name
            </Label>
            <div className="col-span-3">{lead.name}</div>
          </div>
          {!privacyMode && (
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">{lead.email}</div>
            </div>
          )}
          {!privacyMode && (
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <div className="col-span-3">{lead.phone}</div>
            </div>
          )}
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="company" className="text-right">
              Company
            </Label>
            <div className="col-span-3">{lead.company}</div>
          </div>
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

function ForwardLead({ leadId }: { leadId: number }) {
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
