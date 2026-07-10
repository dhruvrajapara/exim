export default function BlogContent({ content }) {
  if (!content) return null;

  return (
    <article 
      className="text-gray-600 text-[18px] leading-[1.9] max-w-none 
                 [&>h2]:text-[32px] [&>h2]:font-bold [&>h2]:text-dark [&>h2]:mb-6 [&>h2]:mt-12 [&>h2]:font-rubik
                 [&>h3]:text-[24px] [&>h3]:font-bold [&>h3]:text-dark [&>h3]:mb-4 [&>h3]:mt-8 [&>h3]:font-rubik
                 [&>p]:mb-6
                 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:pl-2
                 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
                 [&>blockquote]:border-l-4 [&>blockquote]:border-[#0B63CE] [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:my-8 [&>blockquote]:bg-[#EAF4FF] [&>blockquote]:rounded-r-[12px] [&>blockquote]:text-dark [&>blockquote]:italic [&>blockquote]:font-medium
                 [&>img]:rounded-[20px] [&>img]:shadow-md [&>img]:my-8 [&>img]:w-full
                 [&>pre]:bg-[#00143A] [&>pre]:text-white [&>pre]:p-6 [&>pre]:rounded-[16px] [&>pre]:my-8 [&>pre]:overflow-x-auto
                 [&>code]:bg-gray-100 [&>code]:text-[#0B63CE] [&>code]:px-2 [&>code]:py-1 [&>code]:rounded-[6px] [&>code]:text-[15px]
                 [&>strong]:text-dark [&>strong]:font-bold
                 [&>a]:text-[#0B63CE] [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-dark"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
