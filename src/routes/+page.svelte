<script>
  import { onMount } from 'svelte';

  let emailType = '';
  let userEmail = '';
  let aiGeneratedEmail = '';
  let isLoading = false;

  const emailTypes = [
    'job application',
    'meeting request',
    'complaint',
    'apology',
    'project update',
    'introduction',
    'follow-up'
  ];

  function randomizeEmailType() {
    const randomIndex = Math.floor(Math.random() * emailTypes.length);
    emailType = emailTypes[randomIndex];
  }

  async function generateAIEmail() {
    isLoading = true;
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailType })
      });
      const data = await response.json();
      aiGeneratedEmail = data.email;
    } catch (error) {
      console.error('Error:', error);
      aiGeneratedEmail = 'Error generating email. Please try again.';
    }
    isLoading = false;
  }

  function copyEmailToClipboard() {
    if (aiGeneratedEmail) {
      navigator.clipboard.writeText(aiGeneratedEmail);
      alert('Email copied to clipboard! Paste it into the text area to view.');
    }
  }

  onMount(randomizeEmailType);
</script>

<main class="container">
  <div class="task-section">
    <h2 class="title">email writing practice.</h2>
    <div class="task-info">
      <button on:click={randomizeEmailType} class="task-button">
        generate new subject
      </button>
      <h2 class="task-title">email subject: <span class="task-type">{emailType}</span></h2>
    </div>
  </div>

  <div class="email-section">
    <h3 class="section-title">write your email</h3>
    <textarea bind:value={userEmail} class="email-textarea" placeholder="write your email here..."></textarea>

    <div class="help-section">
      <p class="help-text">need help? generate the email using AI</p>
      <button on:click={generateAIEmail} class="generate-button" disabled={isLoading}>
        {isLoading ? 'generating...' : 'generate AI email'}
      </button>
    </div>

    {#if aiGeneratedEmail}
      <button on:click={copyEmailToClipboard} class="copy-button">
        copy to clipboard
      </button>
    {/if}
  </div>
</main>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }

  .title {
    font-size: 3rem;
    font-weight: 800;
    text-align: center;
    background: linear-gradient(to right, #3b82f6, #10b981);
    -webkit-background-clip: text;
    color: transparent;
  }

  .task-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .task-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .task-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
  }

  .task-type {
    color: #3b82f6;
  }

  .task-button {
    background: linear-gradient(to right, #3b82f6, #10b981);
    color: white;
    font-weight: bold;
    padding: 0.5rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .task-button:hover {
    transform: scale(1.05);
  }

  .email-section {
    background: white;
    padding: 1.5rem;
    border-radius: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    transition: box-shadow 0.2s;
    width: 100%;
    max-width: 500px;
    text-align: center;
  }

  .email-section:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
  }

  .email-textarea {
    width: 100%;
    height: 20rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    resize: none;
    outline: none;
    transition: box-shadow 0.2s;
    box-sizing: border-box;
  }

  .email-textarea:focus {
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
  }

  .help-section {
    margin-top: 1rem;
  }

  .help-text {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #6b7280;
  }

  .generate-button {
    background: linear-gradient(to right, #10b981, #3b82f6);
    color: white;
    font-weight: bold;
    padding: 0.5rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .generate-button:hover {
    transform: scale(1.05);
  }

  .generate-button:disabled {
    opacity: 0.5;
  }

  .copy-button {
    background: linear-gradient(to right, #3b82f6, #10b981);
    color: white;
    font-weight: bold;
    padding: 0.5rem 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    margin-top: 1rem;
  }

  .copy-button:hover {
    transform: scale(1.05);
  }
</style>