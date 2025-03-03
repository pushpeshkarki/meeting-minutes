// Simple wrapper for Tauri functionality
export async function invoke(cmd: string, args?: any): Promise<any> {
  // For now, we'll just return mock responses
  switch (cmd) {
    case 'check_ollama_installation':
      return false;
    case 'install_ollama':
      return true;
    case 'start_ollama_service':
      return true;
    default:
      throw new Error(`Unknown command: ${cmd}`);
  }
} 