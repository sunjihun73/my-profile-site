// ===== 여기만 수정하면 사이트 내용이 바뀝니다 =====
const profile = {
  name: '선지헌',
  role: '풀스택 AI 개발자',
  bio: '사용자 경험을 먼저 생각하는 풀스택 개발자입니다. 단순하고 읽기 쉬운 코드로 의미 있는 웹을 만듭니다. 새로운 기술을 배우고 나누는 것을 좋아합니다.',
  skills: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Git', 'Figma'],
  projects: [
    {
      title: '할 일 관리 앱',
      description: '드래그 앤 드롭과 로컬 저장을 지원하는 간단한 할 일 관리 웹앱입니다.',
      tags: ['JavaScript', 'CSS'],
      link: '#',
    },
    {
      title: '날씨 대시보드',
      description: '공개 API로 현재 위치의 날씨와 주간 예보를 보여주는 대시보드입니다.',
      tags: ['HTML', 'Tailwind', 'API'],
      link: '#',
    },
    {
      title: '개인 블로그',
      description: '마크다운으로 글을 작성하고 정적으로 배포하는 개인 블로그입니다.',
      tags: ['Markdown', 'Git'],
      link: '#',
    },
  ],
  contacts: [
    { label: '이메일', value: 'hello@example.com', href: 'mailto:hello@example.com' },
    { label: 'GitHub', value: 'github.com/username', href: 'https://github.com/username' },
  ],
  nav: [
    { label: '소개', href: '#home' },
    { label: '기술', href: '#skills' },
    { label: '프로젝트', href: '#projects' },
    { label: '연락처', href: '#contact' },
  ],
};
// ================================================

const $ = (sel) => document.querySelector(sel);

// textContent만 사용해 XSS 걱정 없이 요소 생성
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function render() {
  document.title = `${profile.name} | ${profile.role}`;
  $('#hero-role').textContent = profile.role;
  $('#hero-name').textContent = profile.name;
  $('#hero-bio').textContent = profile.bio;
  $('#brand').textContent = profile.name;
  $('#footer-text').textContent = `© ${new Date().getFullYear()} ${profile.name}. All rights reserved.`;

  // 네비게이션 (데스크톱 + 모바일)
  const linkClass = 'nav-link block py-2 text-sand/80 hover:text-white';
  profile.nav.forEach((item) => {
    [$('#nav-links'), $('#mobile-menu')].forEach((ul) => {
      const li = el('li');
      const a = el('a', linkClass, item.label);
      a.href = item.href;
      li.appendChild(a);
      ul.appendChild(li);
    });
  });

  // 기술 스택
  profile.skills.forEach((s) => {
    $('#skills-list').appendChild(
      el('li', 'reveal border border-oak/40 px-5 py-2 text-xs uppercase tracking-widest text-oak dark:text-sand', s)
    );
  });

  // 프로젝트 카드
  profile.projects.forEach((p) => {
    const card = el('article', 'reveal flex flex-col rounded-sm border border-espresso/10 bg-white p-8 shadow-[0_10px_30px_-12px_rgba(43,36,29,0.18)] transition duration-300 ease-out hover:-translate-y-2 hover:border-oak/60 hover:shadow-[0_28px_56px_-16px_rgba(43,36,29,0.35)] dark:border-white/10 dark:bg-espresso');
    card.appendChild(el('h3', 'text-lg font-normal uppercase tracking-wide', p.title));
    card.appendChild(el('p', 'mt-3 flex-1 text-espresso/70 dark:text-sand/70', p.description));
    const tags = el('ul', 'mt-4 flex flex-wrap gap-2');
    p.tags.forEach((t) => tags.appendChild(el('li', 'bg-sand px-2 py-1 text-[11px] uppercase tracking-wider dark:bg-white/10', t)));
    card.appendChild(tags);
    const link = el('a', 'mt-6 border-t border-espresso/10 pt-4 text-xs uppercase tracking-[0.18em] text-oak hover:text-espresso dark:border-white/10 dark:hover:text-white', '자세히 보기 →');
    link.href = p.link;
    card.appendChild(link);
    $('#projects-grid').appendChild(card);
  });

  // 연락처
  profile.contacts.forEach((c) => {
    const li = el('li', 'reveal');
    const a = el('a', 'inline-flex flex-col rounded-sm border border-espresso/10 bg-cream px-6 py-5 shadow-[0_10px_30px_-12px_rgba(43,36,29,0.18)] transition hover:-translate-y-0.5 hover:border-oak dark:border-white/10 dark:bg-bark');
    a.href = c.href;
    a.appendChild(el('span', 'text-[11px] uppercase tracking-widest text-espresso/50 dark:text-sand/50', c.label));
    a.appendChild(el('span', 'mt-1 text-oak dark:text-sand', c.value));
    li.appendChild(a);
    $('#contact-list').appendChild(li);
  });
}

// 다크모드
function setupTheme() {
  const root = document.documentElement;
  const icon = $('#theme-icon');
  const sync = () => { icon.textContent = root.classList.contains('dark') ? '☀️' : '🌙'; };
  sync();
  $('#theme-toggle').addEventListener('click', () => {
    root.classList.toggle('dark');
    try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
    sync();
  });
}

// 모바일 메뉴
function setupMenu() {
  const btn = $('#menu-toggle');
  const menu = $('#mobile-menu');
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

// 스크롤 reveal + 현재 섹션 강조
function setupObservers() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((n) => n.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach((n) => io.observe(n));

  const links = document.querySelectorAll('.nav-link');
  const active = ['text-white', 'border-b', 'border-white'];
  const so = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => {
        const on = a.getAttribute('href') === `#${e.target.id}`;
        active.forEach((c) => a.classList.toggle(c, on));
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => so.observe(s));
}

render();
setupTheme();
setupMenu();
setupObservers();
