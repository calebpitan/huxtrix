export function ArticlePreviewHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      {title ? <p className="break-words py-2 text-5xl font-extrabold tracking-tighter">{title}</p> : null}
      {subtitle ? (
        <p className="text-foreground/70 break-words py-1 text-lg font-medium">{subtitle}</p>
      ) : null}
    </>
  )
}
