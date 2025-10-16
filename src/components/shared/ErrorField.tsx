export default function ErrorField(props: { errors?: string[] }) {
  const { errors } = props;
  if (!errors?.length) return <></>;
  return (
    <div className="text-xs my-1 rounded-md">
      {errors?.map((err: string) => (
        <span className="text-destructive text-xs">{err}</span>
      ))}
    </div>
  );
}
