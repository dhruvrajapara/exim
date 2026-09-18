export default function BlogContent({ content }) {
  if (!content) return null;

  return (
    <article 
      className="text-gray-700 text-[16px] md:text-[17px] leading-[1.8] max-w-none overflow-hidden break-words
                 [&>h2]:text-[22px] md:[&>h2]:text-[26px] [&>h2]:font-bold [&>h2]:text-dark [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:font-rubik [&>h2]:leading-snug
                 [&>h3]:text-[18px] md:[&>h3]:text-[21px] [&>h3]:font-bold [&>h3]:text-dark [&>h3]:mb-3 [&>h3]:mt-6 [&>h3]:font-rubik [&>h3]:leading-snug
                 [&>h4]:text-[16px] md:[&>h4]:text-[18px] [&>h4]:font-bold [&>h4]:text-dark [&>h4]:mb-2 [&>h4]:mt-5 [&>h4]:font-rubik
                 [&>p]:mb-5
                 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul>li]:mb-2 [&>ul>li]:pl-1 [&>ul>li]:text-[15px] md:[&>ul>li]:text-[16px]
                 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol>li]:mb-2 [&>ol>li]:text-[15px] md:[&>ol>li]:text-[16px]
                 [&>blockquote]:border-l-4 [&>blockquote]:border-[#0B63CE] [&>blockquote]:pl-5 [&>blockquote]:py-3 [&>blockquote]:my-6 [&>blockquote]:bg-[#EAF4FF] [&>blockquote]:rounded-r-[12px] [&>blockquote]:text-dark [&>blockquote]:italic [&>blockquote]:font-medium [&>blockquote]:text-[15px] md:[&>blockquote]:text-[16px]
                 [&>img]:rounded-[16px] [&>img]:shadow-md [&>img]:my-6 [&>img]:w-full
                 [&>pre]:bg-[#00143A] [&>pre]:text-white [&>pre]:p-5 [&>pre]:rounded-[14px] [&>pre]:my-6 [&>pre]:overflow-x-auto [&>pre]:text-[14px]
                 [&>code]:bg-gray-100 [&>code]:text-[#0B63CE] [&>code]:px-2 [&>code]:py-0.5 [&>code]:rounded-[6px] [&>code]:text-[14px]
                 [&>strong]:text-dark [&>strong]:font-semibold
                 [&>a]:text-[#0B63CE] [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-dark"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
