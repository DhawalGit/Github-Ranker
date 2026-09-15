document.addEventListener("DOMContentLoaded", () => {
    // Set dynamic dates
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const todayFormatted = new Date().toLocaleDateString("en-US", options);
    document.getElementById("current-date").textContent = todayFormatted;
    document.getElementById("policy-date").textContent = todayFormatted;

    // Single Page Application Navigation Logic
    const navButtons = document.querySelectorAll(".nav-btn, .footer a[data-page]");
    const pages = document.querySelectorAll(".page-section");

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetPage = btn.getAttribute("data-page");
            if (!targetPage) return;

            pages.forEach(p => p.classList.remove("active"));
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

            document.getElementById(targetPage).classList.add("active");
            const activeNavBtn = document.querySelector(`.nav-btn[data-page="${targetPage}"]`);
            if (activeNavBtn) activeNavBtn.classList.add("active");
        });
    });

    // Engaging, Hook-Driven Pain Point Engine (No overuse of "eliminates")
    function generatePainPoint(repoName, description) {
        const desc = (description || "").toLowerCase();
        
        if (desc.includes("llm") || desc.includes("ai") || desc.includes("gpt") || desc.includes("rag") || desc.includes("agent")) {
            const hooks = [
                `Bypasses hours of custom prompt orchestration and context retrieval setups for ${repoName}.`,
                `Streamlines complex AI agent pipelines into production-ready workflows in minutes.`,
                `Cuts out high memory overhead and inference latency when running LLMs at scale.`
            ];
            return hooks[Math.floor(Math.random() * hooks.length)];
        } 
        
        if (desc.includes("test") || desc.includes("mock") || desc.includes("cypress") || desc.includes("playwright") || desc.includes("qa")) {
            const hooks = [
                `Kills flaky test runs and speeds up your continuous integration pipeline.`,
                `Saves developers from writing endless mock setups and manual test scripts.`,
                `Simplifies complex end-to-end integration testing with zero configuration headache.`
            ];
            return hooks[Math.floor(Math.random() * hooks.length)];
        } 
        
        if (desc.includes("api") || desc.includes("rest") || desc.includes("graphql") || desc.includes("fastapi") || desc.includes("backend")) {
            const hooks = [
                `Replaces hundreds of lines of repetitive backend boilerplate code with a single dependency.`,
                `Slashes endpoint latency and simplifies distributed microservice communication.`,
                `Automates schema validation and API documentation so you can focus on building features.`
            ];
            return hooks[Math.floor(Math.random() * hooks.length)];
        } 
        
        if (desc.includes("ui") || desc.includes("css") || desc.includes("tailwind") || desc.includes("react") || desc.includes("vue") || desc.includes("frontend")) {
            const hooks = [
                `Protects your frontend from inconsistent design tokens and broken responsive views.`,
                `Fast-tracks UI development with production-ready, pre-styled component primitives.`,
                `Halves the time spent tweaking CSS layouts and cross-browser styling quirks.`
            ];
            return hooks[Math.floor(Math.random() * hooks.length)];
        }

        if (desc.includes("db") || desc.includes("database") || desc.includes("sql") || desc.includes("postgres") || desc.includes("redis")) {
            return `Prevents database execution bottlenecks and simplifies complex schema migration workflows.`;
        }

        // Generic fallback hooks
        if (description) {
            return `Automates repetitive engineering tasks around ${description.toLowerCase().replace(/\.$/, '')} so you ship faster.`;
        }
        return `Packs powerful developer tooling to collapse multi-step coding workflows into a single command for ${repoName}.`;
    }

    // AJAX Fetch GitHub Trending Repositories
    async function fetchTopRepos() {
        const container = document.getElementById("repo-container");
        const url = "https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=10";

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("GitHub API Rate Limit or Network Error");
            
            const data = await response.json();
            container.innerHTML = "";

            data.items.forEach((repo, index) => {
                const painPoint = generatePainPoint(repo.name, repo.description);
                const repoHTML = `
                    <div class="repo-card">
                        <div class="repo-header">
                            <div>
                                <div class="repo-title">#${index + 1} <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.owner.login}/${repo.name}</a></div>
                                <p style="margin-top: 5px; color: var(--text-muted);">${repo.description || 'Open source software project.'}</p>
                            </div>
                            <div class="repo-stats">
                                <div>⭐ <strong>${repo.stargazers_count.toLocaleString()}</strong></div>
                                <div>🍴 <strong>${repo.forks_count.toLocaleString()}</strong></div>
                                <span class="badge">${repo.language || 'Dev Tools'}</span>
                            </div>
                        </div>
                        <div class="pain-point">
                            💡 <strong>Task It Solves:</strong> ${painPoint}
                        </div>
                    </div>
                `;
                container.innerHTML += repoHTML;

                // In-feed Ad Placeholder after Item #3 (Commented out active render)
                /* 
                if (index === 2) {
                    container.innerHTML += `
                        <div class="ad-unit infeed-ad">
                            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-0000000000000000" data-ad-slot="2222222222" data-ad-format="auto"></ins>
                            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
                        </div>
                    `;
                }
                */
            });
        } catch (error) {
            container.innerHTML = `<div style="color:red; padding:20px;">Failed to fetch live data: ${error.message}</div>`;
        }
    }

    // Load Archives
    function loadArchives() {
        const archiveContainer = document.getElementById("archive-container");
        const archivedData = [
            {
                name: "vLLM", owner: "vllm-project", stars: 38400, forks: 4900, language: "Python",
                url: "https://github.com/vllm-project/vllm", description: "High-throughput and memory-efficient serving engine for LLMs.",
                pain_task_solved: "Cuts down high GPU memory overhead and eliminates slow inference bottlenecks when serving LLMs in production."
            },
            {
                name: "Bruno", owner: "usebruno", stars: 29100, forks: 1800, language: "JavaScript",
                url: "https://github.com/usebruno/bruno", description: "Fast and git-friendly open-source API client.",
                pain_task_solved: "Replaces heavy Postman workspaces with plain-text offline API collections checked directly into Git."
            }
        ];

        archiveContainer.innerHTML = archivedData.map((repo, idx) => `
            <div class="repo-card">
                <div class="repo-header">
                    <div>
                        <div class="repo-title">#${idx + 1} <a href="${repo.url}" target="_blank" rel="noopener">${repo.owner}/${repo.name}</a></div>
                        <p style="margin-top: 5px;">${repo.description}</p>
                    </div>
                    <div class="repo-stats">
                        <span class="badge">${repo.language}</span>
                    </div>
                </div>
                <div class="pain-point">💡 <strong>Why You Need It:</strong> ${repo.pain_task_solved}</div>
            </div>
        `).join("");
    }

    // Contact Form Handler
    document.getElementById("contact-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const status = document.getElementById("form-status");
        status.innerHTML = `<p style="color: green; margin-top: 10px;">Thank you for reaching out! We will get back to you shortly.</p>`;
        e.target.reset();
    });

    // Initialize
    fetchTopRepos();
    loadArchives();
});