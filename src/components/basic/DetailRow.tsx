import type { JSX } from "react";

export default function DetailRow({ name, value }: { name: string; value: string | number | JSX.Element }) {
    return (
        <>
          {value && <div className="detail-row">
            <strong>{name}:</strong> {value}
          </div>}
        </>
    );
}