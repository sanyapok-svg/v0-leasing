import { notFound } from "next/navigation"
import { getDealById } from "@/lib/mock-data"
import { BuyerDealWorkspace } from "@/components/deal/buyer-deal-workspace"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function BuyerDealPage({ params }: PageProps) {
  const { id } = await params
  const deal = getDealById(id)
  if (!deal) notFound()
  return <BuyerDealWorkspace deal={deal} />
}
