export default function BlogContent({ content }) {
  if (!content) return null;

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-rubik prose-headings:font-bold prose-headings:text-dark prose-h2:text-[28px] md:prose-h2:text-[32px] prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-[22px] md:prose-h3:text-[24px] prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-[#3599FF] hover:prose-a:text-[#0463C3] prose-a:no-underline prose-strong:text-dark prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:text-gray-600 prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:text-gray-700 prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:rounded-r-lg">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
