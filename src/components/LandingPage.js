export class LandingPage {
  constructor(onNavigateToAuth) {
    this.onNavigateToAuth = onNavigateToAuth;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'landing-page';
    container.innerHTML = `
      <nav class="landing-nav">
        <div class="nav-container">
          <div class="logo">
            <h2>TodoMaster</h2>
          </div>
          <button class="btn btn-ghost" id="loginBtn">ログイン</button>
        </div>
      </nav>

      <main class="landing-main">
        <section class="hero">
          <div class="hero-content">
            <h1 class="hero-title">
              タスク管理を<br>
              <span class="gradient-text">もっとシンプルに</span>
            </h1>
            <p class="hero-description">
              TodoMasterは、あなたの日々のタスクを効率的に管理するための<br>
              シンプルで使いやすいTodoアプリケーションです。
            </p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" id="freeTrialBtn">
                無料体験
              </button>
              <button class="btn btn-secondary btn-lg" id="learnMoreBtn">
                詳しく見る
              </button>
            </div>
          </div>
          <div class="hero-image">
            <div class="hero-mockup">
              <div class="mockup-window">
                <div class="mockup-header">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="mockup-content">
                  <div class="mockup-task">✓ 朝のミーティング</div>
                  <div class="mockup-task">✓ レポート作成</div>
                  <div class="mockup-task active">プレゼン準備</div>
                  <div class="mockup-task">メール返信</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="features">
          <div class="container">
            <h2 class="section-title">主な機能</h2>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">📝</div>
                <h3>シンプルなタスク管理</h3>
                <p>直感的なインターフェースで、タスクの追加・編集・削除が簡単に行えます。</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🔄</div>
                <h3>リアルタイム同期</h3>
                <p>すべてのデバイスでタスクが自動的に同期され、どこからでもアクセス可能です。</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3>優先度管理</h3>
                <p>タスクに優先度を設定して、重要なことから効率的に処理できます。</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3>進捗トラッキング</h3>
                <p>完了したタスクを確認し、生産性の向上を実感できます。</p>
              </div>
            </div>
          </div>
        </section>

        <section class="cta">
          <div class="container">
            <h2>今すぐ始めましょう</h2>
            <p>無料でTodoMasterを体験して、タスク管理を改善しましょう。</p>
            <button class="btn btn-primary btn-lg" id="ctaBtn">
              無料体験を始める
            </button>
          </div>
        </section>
      </main>

      <footer class="landing-footer">
        <div class="container">
          <p>&copy; 2024 TodoMaster. All rights reserved.</p>
        </div>
      </footer>
    `;

    // Add event listeners
    container.querySelector('#loginBtn').addEventListener('click', () => {
      this.onNavigateToAuth('signin');
    });

    container.querySelector('#freeTrialBtn').addEventListener('click', () => {
      this.onNavigateToAuth('signup');
    });

    container.querySelector('#ctaBtn').addEventListener('click', () => {
      this.onNavigateToAuth('signup');
    });

    container.querySelector('#learnMoreBtn').addEventListener('click', () => {
      container.querySelector('.features').scrollIntoView({ behavior: 'smooth' });
    });

    return container;
  }
}