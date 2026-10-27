export function ArticlePreviewHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      {title ? <p className="break-words py-2 text-4xl font-extrabold">{title}</p> : null}
      {subtitle ? (
        <p className="text-foreground/70 break-words py-1 text-lg font-light">{subtitle}</p>
      ) : null}
    </>
  )
}
