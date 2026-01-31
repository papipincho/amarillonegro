import requests
import sys
from datetime import datetime
import json

class TaxiPortalAPITester:
    def __init__(self, base_url="https://taxistas-bcn.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Try to parse JSON response
                try:
                    json_response = response.json()
                    if isinstance(json_response, list):
                        print(f"📊 Response: List with {len(json_response)} items")
                        if len(json_response) > 0:
                            print(f"📝 First item keys: {list(json_response[0].keys())}")
                    else:
                        print(f"📊 Response keys: {list(json_response.keys()) if isinstance(json_response, dict) else 'Not a dict'}")
                except:
                    print("📊 Response is not JSON or empty")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Error response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'error': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API", "GET", "api/", 200)

    def test_get_all_services(self):
        """Test getting all services"""
        return self.run_test("Get All Services", "GET", "api/services", 200)

    def test_get_services_by_category(self, category="licencias"):
        """Test getting services by category"""
        return self.run_test(f"Get Services by Category ({category})", "GET", f"api/services/{category}", 200)

    def test_submit_contact_form(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "123456789",
            "service_category": "licencias",
            "business_name": "Test Business",
            "description": "Test description for taxi service",
            "website": "https://test.com"
        }
        return self.run_test("Submit Contact Form", "POST", "api/contact-submission", 200, test_data)

    def test_all_categories(self):
        """Test all expected categories"""
        categories = ["licencias", "gestorias", "talleres", "elementos", "escuelas", "bolsa_trabajo", "emisoras", "seguros"]
        category_results = {}
        
        for category in categories:
            success, response = self.test_get_services_by_category(category)
            category_results[category] = {
                'success': success,
                'count': len(response) if isinstance(response, list) else 0
            }
        
        return category_results

def main():
    print("🚕 Starting Taxi Portal Barcelona API Tests...")
    print("=" * 50)
    
    # Setup
    tester = TaxiPortalAPITester()
    
    # Test basic connectivity
    print("\n🔧 Testing Basic API Connectivity...")
    tester.test_root_endpoint()
    
    # Test services endpoints
    print("\n📋 Testing Services Endpoints...")
    tester.test_get_all_services()
    
    # Test all categories
    print("\n🏷️  Testing Category Endpoints...")
    category_results = tester.test_all_categories()
    
    # Test contact form
    print("\n📧 Testing Contact Form...")
    tester.test_submit_contact_form()
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 FINAL RESULTS:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for test in tester.failed_tests:
                expected_msg = f"Expected {test.get('expected')}, got {test.get('actual')}"
            error_msg = test.get('error', expected_msg)
            print(f"  - {test['name']}: {error_msg}")
    
    print(f"\n🏷️  Category Results:")
    for category, result in category_results.items():
        status = "✅" if result['success'] else "❌"
        print(f"  {status} {category}: {result['count']} services")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())