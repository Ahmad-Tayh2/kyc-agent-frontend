export default function ErrorField(props: { errors?: string[] }) {
  const { errors } = props;
  if (!errors?.length) return <></>;
  return (
    <div className="text-destructive text-xs bg-red-50 py-1 px-2 my-1 rounded-md">
      {errors?.map((err: string) => (
        <div>{err}</div>
      ))}
    </div>
  );
}
