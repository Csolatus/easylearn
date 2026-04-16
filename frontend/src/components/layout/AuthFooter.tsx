export default function AuthFooter() {
  return (
    <footer className="py-6 flex flex-col items-center gap-3">
      <div className="flex items-center gap-6 text-xs text-gray-600 dark:text-gray-400">
        <a href="#" className="hover:text-gray-400 dark:hover:text-gray-600 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-gray-400 dark:hover:text-gray-600 transition-colors">Need help?</a>
        <a href="#" className="hover:text-gray-400 dark:hover:text-gray-600 transition-colors">Legal notice</a>
      </div>
      <p className="text-xs text-gray-700 dark:text-gray-400">
        © {new Date().getFullYear()} EasyLearn. All rights reserved.
      </p>
    </footer>
  );
}
