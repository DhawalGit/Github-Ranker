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

    // Daily cache for fresh GitHub repo recommendations
    const REPO_CACHE_KEY = "github-ranker-cache-v1";
    const REPO_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
    const DISCUSSION_CACHE_KEY = "github-ranker-discussions-v1";

    function getCachedRepos() {
        try {
            const cached = localStorage.getItem(REPO_CACHE_KEY);
            if (!cached) return null;

            const parsed = JSON.parse(cached);
            if (!parsed || !Array.isArray(parsed.items)) return null;

            const isFresh = Date.now() - (parsed.cachedAt || 0) < REPO_CACHE_TTL_MS;
            return isFresh ? parsed.items : null;
        } catch (error) {
            console.warn("Unable to read cached repo list:", error);
            return null;
        }
    }

    function setCachedRepos(items) {
        try {
            localStorage.setItem(REPO_CACHE_KEY, JSON.stringify({
                cachedAt: Date.now(),
                items
            }));
        } catch (error) {
            console.warn("Unable to store cached repo list:", error);
        }
    }

    function getRepoKey(repo) {
        return `${repo.owner.login}/${repo.name}`;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getDiscussionMap() {
        try {
            const stored = localStorage.getItem(DISCUSSION_CACHE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn("Unable to read discussion cache:", error);
            return {};
        }
    }

    function saveDiscussionMap(map) {
        try {
            localStorage.setItem(DISCUSSION_CACHE_KEY, JSON.stringify(map));
        } catch (error) {
            console.warn("Unable to save discussion cache:", error);
        }
    }

    function getCommentsByRepo(repoKey) {
        const map = getDiscussionMap();
        const comments = map[repoKey];
        return Array.isArray(comments) ? comments : [];
    }

    function saveCommentsForRepo(repoKey, comments) {
        const map = getDiscussionMap();
        map[repoKey] = comments;
        saveDiscussionMap(map);
    }

    function formatCommentDate(value) {
        try {
            return new Date(value).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
            });
        } catch (error) {
            return "Just now";
        }
    }

    function buildDiscussionListMarkup(comments) {
        if (!comments.length) {
            return '<div class="discussion-empty">No comments yet. Be the first to add one.</div>';
        }

        return comments.map(comment => `
            <div class="discussion-item">
                <div class="discussion-meta">
                    <strong>${escapeHtml(comment.author || 'Anonymous')}</strong>
                    <span>${formatCommentDate(comment.createdAt)}</span>
                </div>
                <p>${escapeHtml(comment.message || '').replace(/\n/g, '<br>')}</p>
            </div>
        `).join("");
    }

    function buildDiscussionPanelMarkup(repoKey, comments) {
        return `
            <div class="repo-discussion">
                <button class="discussion-toggle" type="button" data-repo-key="${escapeHtml(repoKey)}" aria-expanded="false">
                    💬 Discussion <span class="discussion-count">(${comments.length})</span>
                </button>
                <div class="discussion-panel hidden" data-repo-panel="${escapeHtml(repoKey)}">
                    <div class="discussion-list">
                        ${buildDiscussionListMarkup(comments)}
                    </div>
                    <form class="discussion-form" data-repo-key="${escapeHtml(repoKey)}">
                        <div class="discussion-form-row">
                            <input type="text" name="author" maxlength="40" placeholder="Name (optional)">
                        </div>
                        <div class="discussion-form-row">
                            <textarea name="message" rows="3" maxlength="500" placeholder="Share your suggestion or feedback for this repo..." required></textarea>
                        </div>
                        <button type="submit" class="discussion-submit">Submit Comment</button>
                    </form>
                </div>
            </div>
        `;
    }

    function refreshDiscussionDisplay(repoKey) {
        const container = document.getElementById("repo-container");
        if (!container) return;

        const toggle = container.querySelector(`.discussion-toggle[data-repo-key="${repoKey}"]`);
        const panel = container.querySelector(`.discussion-panel[data-repo-panel="${repoKey}"]`);
        const comments = getCommentsByRepo(repoKey);

        if (toggle) {
            const countNode = toggle.querySelector(".discussion-count");
            if (countNode) countNode.textContent = `(${comments.length})`;
        }

        if (panel) {
            panel.innerHTML = `
                <div class="discussion-list">
                    ${buildDiscussionListMarkup(comments)}
                </div>
                <form class="discussion-form" data-repo-key="${escapeHtml(repoKey)}">
                    <div class="discussion-form-row">
                        <input type="text" name="author" maxlength="40" placeholder="Name (optional)">
                    </div>
                    <div class="discussion-form-row">
                        <textarea name="message" rows="3" maxlength="500" placeholder="Share your suggestion or feedback for this repo..." required></textarea>
                    </div>
                    <button type="submit" class="discussion-submit">Submit Comment</button>
                </form>
            `;
        }
    }

    function attachDiscussionHandlers() {
        const container = document.getElementById("repo-container");
        if (!container || container.dataset.discussionBound === "true") return;

        container.dataset.discussionBound = "true";

        container.addEventListener("click", (event) => {
            const toggle = event.target.closest(".discussion-toggle");
            if (!toggle) return;

            const repoKey = toggle.dataset.repoKey;
            const panel = container.querySelector(`.discussion-panel[data-repo-panel="${repoKey}"]`);
            if (!panel) return;

            const isHidden = panel.classList.toggle("hidden");
            toggle.setAttribute("aria-expanded", String(!isHidden));
        });

        container.addEventListener("submit", (event) => {
            const form = event.target.closest(".discussion-form");
            if (!form) return;

            event.preventDefault();
            const repoKey = form.dataset.repoKey;
            const authorInput = form.querySelector("input[name='author']");
            const messageInput = form.querySelector("textarea[name='message']");
            const message = (messageInput.value || "").trim();

            if (!message) {
                messageInput.focus();
                return;
            }

            const existingComments = getCommentsByRepo(repoKey);
            const updatedComments = [
                ...existingComments,
                {
                    author: (authorInput.value || "").trim() || "Anonymous",
                    message,
                    createdAt: new Date().toISOString()
                }
            ];

            saveCommentsForRepo(repoKey, updatedComments);
            refreshDiscussionDisplay(repoKey);
            form.reset();
        });
    }

    function scoreRepo(repo) {
        const pushedAt = repo.pushed_at ? new Date(repo.pushed_at).getTime() : Date.now();
        const ageInDays = Math.max(0, (Date.now() - pushedAt) / (1000 * 60 * 60 * 24));
        const recencyBoost = Math.max(0, 180 - ageInDays) / 2;
        const starScore = Math.min(repo.stargazers_count || 0, 20000) / 30;
        const forkScore = Math.min(repo.forks_count || 0, 5000) / 25;
        const openIssueBoost = (repo.open_issues_count || 0) > 0 ? 3 : 0;

        return starScore + forkScore + recencyBoost + openIssueBoost;
    }

    function renderRepoList(repos) {
        const container = document.getElementById("repo-container");
        container.innerHTML = "";

        repos.forEach((repo, index) => {
            const repoKey = getRepoKey(repo);
            const painPoint = generatePainPoint(repo.name, repo.description);
            const comments = getCommentsByRepo(repoKey);
            const repoHTML = `
                <div class="repo-card">
                    <div class="repo-header">
                        <div>
                            <div class="repo-title">#${index + 1} <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.owner.login}/${repo.name}</a></div>
                            <p style="margin-top: 5px; color: var(--text-muted);">${repo.description || 'Open source software project.'}</p>
                        </div>
                        <div class="repo-stats">
                            <div>⭐ <strong>${(repo.stargazers_count || 0).toLocaleString()}</strong></div>
                            <div>🍴 <strong>${(repo.forks_count || 0).toLocaleString()}</strong></div>
                            <span class="badge">${repo.language || 'Dev Tools'}</span>
                        </div>
                    </div>
                    <div class="pain-point">
                        💡 <strong>Task It Solves:</strong> ${painPoint}
                    </div>
                    ${buildDiscussionPanelMarkup(repoKey, comments)}
                </div>
            `;
            container.innerHTML += repoHTML;
        });

        attachDiscussionHandlers();
    }

    // AJAX Fetch GitHub Trending Repositories
    async function fetchTopRepos() {
        const container = document.getElementById("repo-container");
        const cachedRepos = getCachedRepos();

        if (cachedRepos && cachedRepos.length) {
            renderRepoList(cachedRepos);
            return;
        }

        const query = "stars:>50 pushed:>2024-01-01";
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=30`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("GitHub API Rate Limit or Network Error");

            const data = await response.json();
            const rankedRepos = (data.items || [])
                .filter(repo => !repo.archived && (repo.stargazers_count || 0) >= 50)
                .map(repo => ({ ...repo, compositeScore: scoreRepo(repo) }))
                .sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0))
                .slice(0, 10)
                .map(({ compositeScore, ...repo }) => repo);

            if (!rankedRepos.length) {
                throw new Error("No active repositories matched the current trending criteria.");
            }

            setCachedRepos(rankedRepos);
            renderRepoList(rankedRepos);
        } catch (error) {
            const fallbackRepos = getCachedRepos();
            if (fallbackRepos && fallbackRepos.length) {
                renderRepoList(fallbackRepos);
                return;
            }

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