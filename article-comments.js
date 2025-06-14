<!-- Blog Comments (Supabase-based placeholder) -->
<section id="comments">
  <h2>Comments</h2>
  <ul id="commentList"></ul>
  <form id="commentForm">
    <textarea id="commentText" placeholder="Write a comment..." required></textarea>
    <button type="submit">Post Comment</button>
  </form>
</section>

<script type="module">
  import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
  const supabase = createClient('https://your-project.supabase.co', 'public-anon-key');
  const commentList = document.getElementById("commentList");
  const form = document.getElementById("commentForm");

  const articleId = new URLSearchParams(location.search).get("id");

  async function loadComments() {
    const { data } = await supabase.from("comments").select("*").eq("article_id", articleId).order("created_at", { ascending: false });
    commentList.innerHTML = data.map(c => \`<li><strong>\${c.username}</strong>: \${c.text}</li>\`).join('');
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const text = document.getElementById("commentText").value;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return alert("Please login first.");

    await supabase.from("comments").insert({
      article_id: articleId,
      user_id: session.user.id,
      username: session.user.email,
      text
    });
    document.getElementById("commentText").value = "";
    loadComments();
  });

  loadComments();
</script>