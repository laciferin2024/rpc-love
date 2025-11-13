import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CsvRow } from "@/store/rpc-form-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface CsvPreviewTableProps {
  title: string;
  data: CsvRow[];
  isLoading: boolean;
  error: string | null;
  columnsToShow?: string[];
}
export function CsvPreviewTable({ title, data, isLoading, error, columnsToShow }: CsvPreviewTableProps) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const displayHeaders = columnsToShow ? columnsToShow.filter(h => headers.includes(h)) : headers;
  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {displayHeaders.map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={displayHeaders.length} className="h-24 text-center text-destructive">
            Error loading data: {error}
          </TableCell>
        </TableRow>
      );
    }
    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={displayHeaders.length} className="h-24 text-center text-muted-foreground">
            No entries found.
          </TableCell>
        </TableRow>
      );
    }
    return data.slice(0, 10).map((row, rowIndex) => ( // Show first 10 rows for preview
      <TableRow key={rowIndex}>
        {displayHeaders.map((header, cellIndex) => (
          <TableCell key={cellIndex} className="text-xs truncate max-w-xs">
            {String(row[header])}
          </TableCell>
        ))}
      </TableRow>
    ));
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {displayHeaders.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderContent()}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}