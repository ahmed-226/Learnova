const FloatingDecoration = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-primary-400/30 dark:bg-primary-300/20 rounded-full blur-3xl"></div>
              <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-secondary-400/30 dark:bg-secondary-300/20 rounded-full blur-3xl"></div>
            </div>
    );
}

export default FloatingDecoration;