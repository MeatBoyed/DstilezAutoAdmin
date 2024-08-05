"use client";

import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, DialogContent, Dialog, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import LeadDialog from "./leadDialog";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  [key: string]: any;
}

export default function LeadTable({ privacyMode }: { privacyMode?: boolean }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: string; order: string }>({ key: "name", order: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>(undefined);
  const leads = useMemo<Lead[]>(() => {
    return [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "555-1234",
        company: "Acme Inc.",
        status: "New",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "555-5678",
        company: "Globex Corp.",
        status: "Contacted",
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "555-9012",
        company: "Stark Industries",
        status: "Qualified",
      },
      {
        id: 4,
        name: "Alice Williams",
        email: "alice@example.com",
        phone: "555-3456",
        company: "Wayne Enterprises",
        status: "New",
      },
      {
        id: 5,
        name: "Tom Davis",
        email: "tom@example.com",
        phone: "555-7890",
        company: "Oscorp",
        status: "Contacted",
      },
      {
        id: 6,
        name: "Sarah Lee",
        email: "sarah@example.com",
        phone: "555-2345",
        company: "Stark Industries",
        status: "Qualified",
      },
      {
        id: 7,
        name: "Michael Brown",
        email: "michael@example.com",
        phone: "555-6789",
        company: "Globex Corp.",
        status: "New",
      },
      {
        id: 8,
        name: "Emily Wilson",
        email: "emily@example.com",
        phone: "555-0123",
        company: "Wayne Enterprises",
        status: "Contacted",
      },
      {
        id: 9,
        name: "David Lee",
        email: "david@example.com",
        phone: "555-4567",
        company: "Oscorp",
        status: "Qualified",
      },
      {
        id: 10,
        name: "Jessica Thompson",
        email: "jessica@example.com",
        phone: "555-8901",
        company: "Acme Inc.",
        status: "New",
      },
    ]
      .filter((lead) => {
        const searchValue = search.toLowerCase();
        return (
          lead.name.toLowerCase().includes(searchValue) ||
          lead.email.toLowerCase().includes(searchValue) ||
          lead.phone.toLowerCase().includes(searchValue) ||
          lead.company.toLowerCase().includes(searchValue) ||
          lead.status.toLowerCase().includes(searchValue)
        );
      })
      .sort((a: Lead, b: Lead) => {
        if (sort.order === "asc") {
          return a[sort.key] > b[sort.key] ? 1 : -1;
        } else {
          return a[sort.key] < b[sort.key] ? 1 : -1;
        }
      })
      .slice((page - 1) * pageSize, page * pageSize);
  }, [search, sort, page, pageSize]);
  const totalPages = Math.ceil(leads.length / pageSize);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Leads</CardTitle>
        <CardDescription>View and manage your captured leads.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Search & Page size */}
          <div className="flex items-center justify-between">
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex items-center gap-2">
              <Label htmlFor="pageSize">Show</Label>
              <Select
                value={pageSize.toString()}
                defaultValue={pageSize.toString()}
                onValueChange={(e) => setPageSize(parseInt(e))}
              >
                <SelectTrigger className="min-w-max">
                  <SelectValue placeholder="Per page" className="focus:ring-0" />
                </SelectTrigger>
                <SelectContent className="w-full" align="end">
                  <SelectItem value="10">5</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() =>
                    setSort({
                      key: "name",
                      order: sort.key === "name" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                    })
                  }
                >
                  Name
                  {sort.key === "name" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                {!privacyMode && (
                  <TableHead
                    className="cursor-pointer"
                    onClick={() =>
                      setSort({
                        key: "email",
                        order: sort.key === "email" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                      })
                    }
                  >
                    Email
                    {sort.key === "email" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                  </TableHead>
                )}
                {!privacyMode && (
                  <TableHead
                    className="cursor-pointer"
                    onClick={() =>
                      setSort({
                        key: "phone",
                        order: sort.key === "phone" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                      })
                    }
                  >
                    Phone
                    {sort.key === "phone" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                  </TableHead>
                )}
                <TableHead
                  className="cursor-pointer"
                  onClick={() =>
                    setSort({
                      key: "company",
                      order: sort.key === "company" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                    })
                  }
                >
                  Company
                  {sort.key === "company" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() =>
                    setSort({
                      key: "status",
                      order: sort.key === "status" ? (sort.order === "asc" ? "desc" : "asc") : "asc",
                    })
                  }
                >
                  Status
                  {sort.key === "status" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} onClick={() => setSelectedLead(lead)} className="cursor-pointer hover:bg-muted">
                  <TableCell>{lead.name}</TableCell>
                  {/* <TableCell>{lead.email}</TableCell> */}
                  {/* <TableCell>{lead.phone}</TableCell> */}
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>
                    <Badge variant={lead.status === "New" ? "outline" : lead.status === "Contacted" ? "secondary" : "default"}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Items per page & Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, leads.length)} of {leads.length} leads
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(Math.max(page - 1, 1));
                    }}
                    // disabled={!!!(page === 1)}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p);
                      }}
                      isActive={p === page}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(Math.min(page + 1, totalPages));
                    }}
                    // disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
      {/* Lead Dialog */}
      {selectedLead && <LeadDialog privacyMode lead={selectedLead} onOpenChange={() => setSelectedLead(undefined)} />}
    </Card>
  );
}
