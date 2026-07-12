type SectionHeadingProps = {
  title: string;
};

export default function SectionHeading({
  title,
}: SectionHeadingProps) {
  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        padding: "6px 10px",
        marginTop: "18px",
        marginBottom: "12px",
        borderLeft: "5px solid #000",
      }}
    >
      <h4
        style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          lineHeight: "1.2",
        }}
      >
        {title}
      </h4>
    </div>
  );
}