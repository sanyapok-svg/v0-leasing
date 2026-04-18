import { notFound } from "next/navigation"
import { getDealById } from "@/lib/mock-data"
import { SellerDealWorkspace } from "@/components/deal/seller-deal-workspace"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SellerDealPage({ params }: PageProps) {
  const { id } = await params
  const deal = getDealById(id)
  if (!deal) notFound()
  return <SellerDealWorkspace deal={deal} />
}
