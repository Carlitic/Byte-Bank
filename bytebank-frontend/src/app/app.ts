import { Component, signal, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly authService = inject(AuthService);
  protected readonly title = signal('bytebank-frontend');

  // Theme & Color settings state
  protected readonly theme = signal<'light' | 'dark' | 'system'>(
    (localStorage.getItem('bytebank_theme') as any) || 'dark'
  );
  protected readonly color = signal<'green' | 'blue' | 'purple' | 'amber'>(
    (localStorage.getItem('bytebank_color') as any) || 'green'
  );

  constructor() {
    // Effect to apply theme (light / dark / system)
    effect(() => {
      const currentTheme = this.theme();
      const documentElement = document.documentElement;
      
      let resolvedTheme = currentTheme;
      if (currentTheme === 'system') {
        const prefersDark = typeof window !== 'undefined' && 
                             window.matchMedia && 
                             window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolvedTheme = prefersDark ? 'dark' : 'light';
      }
      
      documentElement.setAttribute('data-theme', resolvedTheme);
      localStorage.setItem('bytebank_theme', currentTheme);
    });

    // Effect to apply accent color
    effect(() => {
      const currentColor = this.color();
      document.documentElement.setAttribute('data-color', currentColor);
      localStorage.setItem('bytebank_color', currentColor);
    });

    this.setupSystemThemeListener();
  }

  private setupSystemThemeListener(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (this.theme() === 'system') {
          const resolvedTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', resolvedTheme);
        }
      });
    }
  }

  protected setTheme(newTheme: 'light' | 'dark' | 'system'): void {
    this.theme.set(newTheme);
  }

  protected setColor(newColor: 'green' | 'blue' | 'purple' | 'amber'): void {
    this.color.set(newColor);
  }
}
