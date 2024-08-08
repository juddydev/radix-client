import { useLoaderData } from "@remix-run/react"
import { Card } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { loader } from "~/routes/($locale).products.$handle._index/route"

export function ProductMaterialTable() {
  const data = useLoaderData<typeof loader>()

  function extractLetters(str: string): string {
    const regex = /[a-zA-Z\u3040-\u30ff\u4e00-\u9fff]/g
    const matches = str.match(regex)
    return matches ? matches.join("") : ""
  }

  return (
    <Card>
      <Table className="text-xs">
        <TableBody>
          <TableRow>
            <TableCell className="bg-neutral-100">{"素材"}</TableCell>
            <TableCell>
              {data.product.materials?.value &&
                extractLetters(data.product.materials?.value)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-neutral-100">{"原産国"}</TableCell>
            <TableCell>{data.product.country_of_origin?.value}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="bg-neutral-100">{"お手入れ"}</TableCell>
            <TableCell>
              {data.product.maintenance?.value &&
                extractLetters(data.product.maintenance?.value)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  )
}
