// components/StructuredData.tsx
import React from "react";

interface StructuredDataProps {
  data: object;
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return <script type="application/ld+json">{JSON.stringify(data)}</script>;
};

export default StructuredData;
