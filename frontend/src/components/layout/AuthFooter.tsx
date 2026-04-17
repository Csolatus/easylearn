export default function AuthFooter() {
  return (
    <footer className="py-6 flex flex-col items-center gap-3">
      <div className="flex items-center gap-6 text-xs text-muted">
        <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-foreground transition-colors">Need help?</a>
        <a href="#" className="hover:text-foreground transition-colors">Legal notice</a>
      </div>
      <p className="text-xs text-muted">
        © {new Date().getFullYear()} EasyLearn. All rights reserved.
      </p>
    </footer>
  );
}
