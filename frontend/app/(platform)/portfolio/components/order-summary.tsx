// features/trade/components/OrderSummary.tsx
type Props = {
  quantity: string;
  price: string;
  transactionFee: string;
  isSell: boolean;
};

export function OrderSummary({
  quantity,
  price,
  transactionFee,
  isSell,
}: Props) {
  const qty = Number.parseFloat(quantity || "0");
  const prc = Number.parseFloat(price || "0");
  const fee = Number.parseFloat(transactionFee || "0");

  const subtotal = qty * prc;
  const total = isSell ? subtotal - fee : subtotal + fee;

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <h4 className="font-semibold mb-2">Order Summary</h4>
      <div className="space-y-1 text-sm">
        <Row label="Shares" value={quantity} />
        <Row label="Price per share" value={`$${price || "0.00"}`} />
        <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
        <Row label="Transaction Fee" value={`$${transactionFee}`} />
        <Row
          label="Total"
          value={`$${total.toFixed(2)}`}
          bold
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold ? "font-semibold border-t pt-1" : ""
      }`}
    >
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
}

