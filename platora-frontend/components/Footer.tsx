import { Github, Mail, Twitter } from 'lucide-react';

export default function Footer() {
	return (
		<footer className="border-t mt-12 bg-white/60 dark:bg-black/40 backdrop-blur-sm">
			<div className="page-max py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
				<div className="flex items-center gap-3">
					<div className="h-8 w-8 rounded-md bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-sm">P
					</div>
					<div>
						<div className="font-semibold">Platora</div>
						<div className="text-xs text-muted-foreground">Order food from local restaurants</div>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<a href="#" className="flex items-center gap-2 hover:text-slate-900">
						<Mail className="h-4 w-4"/>
						<span>Contact</span>
					</a>
					<a href="#" className="flex items-center gap-2 hover:text-slate-900">
						<Twitter className="h-4 w-4"/>
						<span>Twitter</span>
					</a>
					<a href="#" className="flex items-center gap-2 hover:text-slate-900">
						<Github className="h-4 w-4"/>
						<span>Source</span>
					</a>
				</div>
			</div>
		</footer>
	);
}
