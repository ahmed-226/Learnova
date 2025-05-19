import React from 'react';

const TextLessonContent = ({ content, onComplete, onNext, isCompleted }) => {
  const lessonContent = {
    title: content.title,
    body: `
      <h2>Introduction</h2>
      <p>This is a sample text lesson. In a real application, this content would be fetched from a database and could include rich HTML content with images, code examples, and more.</p>
      
      <h2>Key Concepts</h2>
      <p>Here's where we would discuss the important concepts for this lesson. The content can be as rich as needed with proper formatting.</p>
      
      <h3>Subsection Example</h3>
      <p>We can have nested sections with different heading levels and formatting options like <strong>bold text</strong>, <em>italic text</em>, and more.</p>
      
      <pre><code>
// Example code block
function exampleFunction() {
  console.log("Hello, World!");
}
      </code></pre>
      
      <h2>Conclusion</h2>
      <p>This concludes our sample text lesson. In a real lesson, this would be much more comprehensive and tailored to the specific topic being covered.</p>
    `
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">{lessonContent.title}</h1>
        <div 
          className="prose prose-primary dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: lessonContent.body }}
        />
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between">
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          Estimated reading time: {content.duration}
        </div>
        
        <div className="flex items-center space-x-4">
          {!isCompleted ? (
            <button 
              onClick={onComplete}
              className="btn btn-primary"
            >
              Mark as Completed
            </button>
          ) : (
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </span>
          )}
          
          <button 
            onClick={onNext}
            className="btn btn-outline"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextLessonContent;